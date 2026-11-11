'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'

export default function Page() {
  // Defaults to POST /api/chat, handled by app/api/chat/route.js
  const { messages, sendMessage, status, stop, error } = useChat()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    sendMessage({ text })
    setInput('')
  }

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.role}`}>
            {m.parts.map((part, i) =>
              part.type === 'text' ? <span key={i}>{part.text}</span> : null
            )}
          </div>
        ))}
        {status === 'submitted' && <div className="msg assistant pending">…</div>}
        {error && <div className="msg error">Error: {error.message}</div>}
        <div ref={bottomRef} />
      </div>
      <form className="input" onSubmit={send}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          autoFocus
        />
        {busy ? (
          <button type="button" onClick={stop}>Stop</button>
        ) : (
          <button type="submit" disabled={!input.trim()}>Send</button>
        )}
      </form>
    </div>
  )
}
