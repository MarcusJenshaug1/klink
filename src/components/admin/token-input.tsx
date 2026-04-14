'use client'

import { useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface TokenInputHandle {
  insertToken: (token: string) => void
}

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  autoFocus?: boolean
  className?: string
}

function chipLabel(token: string): string {
  const m = /^\{spiller(\d*)\}$/.exec(token)
  if (!m) return token
  return m[1] ? `#${m[1]}` : 'Tilfeldig'
}

function makeChip(token: string): HTMLSpanElement {
  const chip = document.createElement('span')
  chip.contentEditable = 'false'
  chip.dataset.token = token
  chip.className = 'klink-token'
  chip.innerHTML = `${chipLabel(token)}<span class="klink-token-delete" data-action="delete">✕</span>`
  return chip
}

function toHtml(val: string): string {
  return val.split(/(\{spiller\d*\}|\{sips\})/).map(part => {
    if (/^\{spiller\d*\}$/.test(part) || part === '{sips}') {
      const label = part === '{sips}' ? '{sips}' : chipLabel(part)
      return `<span contenteditable="false" data-token="${part}" class="klink-token">${label}<span class="klink-token-delete" data-action="delete">✕</span></span>`
    }
    return part
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }).join('')
}

function fromDom(el: HTMLElement): string {
  let result = ''
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent
    } else if (node instanceof HTMLElement && node.dataset.token) {
      result += node.dataset.token
    }
  }
  return result
}

/**
 * Scans for #N shorthand in text nodes and auto-converts to chips.
 * Preserves cursor position when possible.
 * Returns true if any replacement was made.
 */
function autoConvert(el: HTMLElement): boolean {
  const sel = window.getSelection()
  const cursorNode = sel?.rangeCount ? sel.getRangeAt(0).startContainer : null
  const cursorOffset = sel?.rangeCount ? sel.getRangeAt(0).startOffset : 0

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      // Skip text nodes directly inside a chip span
      return (node.parentElement as HTMLElement)?.dataset?.token
        ? NodeFilter.FILTER_SKIP
        : NodeFilter.FILTER_ACCEPT
    },
  })

  let found: { node: Text; index: number; raw: string; token: string } | null = null
  let textNode: Text | null
  while ((textNode = walker.nextNode() as Text | null)) {
    const m = /#(\d)(?!\d)/.exec(textNode.textContent!)
    if (m) {
      found = {
        node: textNode,
        index: m.index,
        raw: m[0],
        token: `{spiller${m[1]}}`,
      }
      break
    }
  }
  if (!found) return false

  const { node, index, raw, token } = found
  const before = node.textContent!.slice(0, index)
  const after = node.textContent!.slice(index + raw.length)

  const beforeNode = document.createTextNode(before)
  const afterNode = document.createTextNode(after)
  const chip = makeChip(token)

  const parent = node.parentNode!
  parent.insertBefore(beforeNode, node)
  parent.insertBefore(chip, node)
  parent.insertBefore(afterNode, node)
  parent.removeChild(node)

  // Restore cursor: if cursor was in this text node, move it after the chip
  if (sel && cursorNode === node) {
    const range = document.createRange()
    const newOffset = cursorOffset > index + raw.length
      ? cursorOffset - index - raw.length
      : 0
    range.setStart(afterNode, Math.max(0, newOffset))
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  return true
}

export const TokenInput = forwardRef<TokenInputHandle, Props>(
  ({ value, onChange, placeholder, rows = 3, autoFocus, className }, ref) => {
    const divRef = useRef<HTMLDivElement>(null)
    const isEditingRef = useRef(false)

    // Sync value prop → DOM (skips while user is typing to avoid cursor jumps)
    useEffect(() => {
      if (isEditingRef.current) return
      const el = divRef.current
      if (el) el.innerHTML = toHtml(value)
    }, [value])

    useImperativeHandle(ref, () => ({
      insertToken(token: string) {
        const el = divRef.current
        if (!el) return
        el.focus()

        const chip = makeChip(token)
        const sel = window.getSelection()
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0)
          range.deleteContents()
          range.insertNode(chip)
          range.setStartAfter(chip)
          range.setEndAfter(chip)
          sel.removeAllRanges()
          sel.addRange(range)
        } else {
          el.appendChild(chip)
        }

        isEditingRef.current = true
        onChange(fromDom(el))
        requestAnimationFrame(() => { isEditingRef.current = false })
      },
    }))

    const handleInput = useCallback(() => {
      const el = divRef.current
      if (!el) return
      isEditingRef.current = true
      // Auto-convert #N shorthand to chips
      autoConvert(el)
      onChange(fromDom(el))
      requestAnimationFrame(() => { isEditingRef.current = false })
    }, [onChange])

    const handleClick = useCallback((e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.dataset.action === 'delete') {
        e.preventDefault()
        const chip = target.closest<HTMLElement>('[data-token]')
        chip?.remove()
        if (divRef.current) onChange(fromDom(divRef.current))
      }
    }, [onChange])

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
      e.preventDefault()
      document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
    }, [])

    return (
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onClick={handleClick}
        onPaste={handlePaste}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        data-placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border border-cream-dark bg-cream text-sm text-charcoal leading-relaxed',
          'px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/30',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-forest/30 empty:before:pointer-events-none',
          className,
        )}
        style={{ minHeight: `${rows * 1.6 + 1.25}rem` }}
      />
    )
  }
)
TokenInput.displayName = 'TokenInput'
