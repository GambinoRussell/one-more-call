import React, { useMemo, useRef, useState, useEffect } from 'react'

const chapters = [
  {
    id: 'opening-call',
    type: 'voicemail',
    title: 'One More Call',
    mood: 'warm',
    icon: '☎',
    lines: [
      'Hi sweetheart... it is Mom.',
      'If this backup ever restores, promise me you will not listen while standing still.',
      'Walk around. Touch the walls. Let the house tell you what I forgot.',
      'And if you find something strange in the stairs...',
      'Please remember I loved you before I remembered anything else.'
    ],
    after: 'Recovered audio. Date unavailable.'
  },
  {
    id: 'breakfast',
    type: 'face',
    title: 'Kitchen Light',
    mood: 'morning',
    icon: '❤',
    instruction: 'Click to advance. Some lines pause on purpose.',
    beats: [
      { who: 'Mom', text: 'Breakfast first. You cannot fight the world hungry.' },
      { who: 'Child', text: 'I am not fighting the world.' },
      { who: 'Mom', text: 'Not yet.' },
      { stage: 'She laughs, but her hand shakes while placing the spoon beside your plate.', pause: 1200 },
      { who: 'Child', text: 'Why do you always look at the stairs?' },
      { who: 'Mom', text: 'Because houses remember footsteps better than people do.' },
      { who: 'Child', text: 'That makes no sense.' },
      { who: 'Mom', text: 'Most true things do not, at first.' },
      { stage: 'She wipes your cheek with her thumb. You complain. Years later, you would give anything to feel embarrassed again.', pause: 1400 }
    ]
  },
  {
    id: 'school-messages',
    type: 'phone',
    title: 'Messages You Answered Badly',
    mood: 'city',
    icon: '💬',
    instruction: 'Tap each message. The phone panel scrolls inside itself.',
    messages: [
      { who: 'Mom', text: 'Good luck today.' },
      { who: 'Mom', text: 'Extra rice is packed. Share if someone forgot lunch.' },
      { who: 'You', text: 'Ok.' },
      { who: 'Mom', text: 'Just ok?' },
      { who: 'You', text: 'I am in class.' },
      { who: 'Mom', text: 'Sorry. I just wanted to be part of your day.' },
      { who: 'Mom', text: 'The stairs creaked last night. I thought you came home.' },
      { who: 'System', text: 'You do not remember coming home.' }
    ],
    choices: ['I will call later.', 'Stop worrying.', 'Love you too.'],
    after: 'Whatever you send, it is smaller than what you meant.'
  },
  {
    id: 'star-count',
    type: 'stars',
    title: 'Count The Stars',
    mood: 'night',
    icon: '★',
    instruction: 'Click the glowing stars. Count slowly with her.',
    target: 7,
    lines: [
      'One is for the first time you held my finger.',
      'Two is for the soup you hated but finished.',
      'Three is for the blanket under our backs.',
      'Four is for the messages I wrote twice and sent once.',
      'Five is for the nights I waited by the phone.',
      'Six is for the things I hid to keep you young.',
      'Seven is for the star that keeps trying even when no one looks.'
    ],
    after: 'You thought she was teaching you constellations. She was teaching you how to remember.'
  },
  {
    id: 'stairs-note',
    type: 'stairs',
    title: 'The House Remembers',
    mood: 'void',
    icon: '⌂',
    instruction: 'Climb each stair. One loose board hides a note.',
    steps: [
      'Step 1: The wood complains under your weight.',
      'Step 2: A dust line marks where the old blanket used to drag behind you.',
      'Step 3: You hear humming, but the house is empty.',
      'Step 4: A loose board lifts slightly.',
      'Step 5: Something is folded underneath.',
      'Step 6: It is your handwriting, but you do not remember writing it.',
      'Step 7: The note says, If I forget first, tell me I was a good mother.'
    ],
    hidden: 'Pressed into the back of the paper: You came home that night. Why do you not remember?',
    after: 'The memory does not answer. It only opens another door.'
  },
  {
    id: 'dragon-field',
    type: 'face',
    title: 'The Dragon Constellation',
    mood: 'night',
    icon: '★',
    instruction: 'A face-to-face memory. Continue only when ready.',
    beats: [
      { stage: 'You lie beside her on the old blanket. The grass is cold. Her hand is warm.' },
      { who: 'Child', text: 'Where is the dragon?' },
      { who: 'Mom', text: 'Start with the brightest star.' },
      { who: 'Child', text: 'That one?' },
      { who: 'Mom', text: 'No. The one trying its best.' },
      { who: 'Child', text: 'Stars do not try.' },
      { who: 'Mom', text: 'People do. Quietly. Every day.' },
      { who: 'Child', text: 'Are you trying?' },
      { who: 'Mom', text: 'More than you know.' },
      { stage: 'Her voice breaks. She turns it into a laugh before you can ask why.', pause: 1300 },
      { who: 'Mom', text: 'If you lose me, do not look in one place.' },
      { who: 'Child', text: 'Where should I look?' },
      { who: 'Mom', text: 'In the things I repeated until you hated hearing them.' },
      { who: 'Mom', text: 'Eat first. Bring a jacket. Look at the stars. Call me when you get home.' }
    ]
  },
  {
    id: 'busy-years',
    type: 'phone',
    title: 'Years That Answered For You',
    mood: 'city',
    icon: '💬',
    instruction: 'Life scrolls. The messages stay.',
    messages: [
      { who: 'Mom', text: 'Made your favorite soup today.' },
      { who: 'Mom', text: 'If you come home this weekend, I will save some.' },
      { who: 'System', text: 'No reply sent.' },
      { who: 'Mom', text: 'Pretty stars tonight.' },
      { who: 'Mom', text: 'Remember our dragon constellation?' },
      { who: 'System', text: 'Seen.' },
      { who: 'Mom', text: 'I found the old blanket.' },
      { who: 'System', text: 'Seen.' },
      { who: 'Mom', text: 'The doctor says some days may go missing.' },
      { who: 'Mom', text: 'If I forget you are grown, please let me be your mother anyway.' }
    ],
    choices: ['Busy today.', 'Maybe next week.', 'I miss the blanket.'],
    after: 'The message sends. Time does not slow down.'
  },
  {
    id: 'missed-call',
    type: 'call-choice',
    title: 'The Call During The Meeting',
    mood: 'rain',
    icon: '☎',
    instruction: 'Choose what kind of person you were that day.',
    rings: [
      'Mom is calling...',
      'Your meeting starts in one minute.',
      'The screen lights up beside your laptop.',
      'Everyone waits for you to present.'
    ],
    choices: [
      { label: 'Answer', result: 'You answer. She whispers, I only wanted your voice. Then: Did you hear the stairs?' },
      { label: 'Decline', result: 'The word Declined looks heavier than it should. A later message says: It is okay. I heard you come in anyway.' },
      { label: 'Let It Ring', result: 'It rings until it stops. The voicemail is five seconds of breathing, then one wooden step creaking.' }
    ]
  },
  {
    id: 'hospital',
    type: 'phone',
    title: 'Hospital Window',
    mood: 'hospital',
    icon: '☾',
    instruction: 'Read slowly. The late messages know things you do not.',
    messages: [
      { who: 'Mom', text: 'Doctor appointment today.' },
      { who: 'You', text: 'Everything okay?' },
      { who: 'Mom', text: 'Just getting old.' },
      { who: 'Mom', text: 'Hospital again.' },
      { who: 'You', text: 'Want me to come?' },
      { who: 'Mom', text: 'No sweetheart. Focus on work.' },
      { who: 'Mom', text: 'Could not see many stars tonight.' },
      { who: 'Mom', text: 'It is okay. I remember where they are.' },
      { who: 'Mom', text: 'If I forget, count them for me.' },
      { who: 'Mom', text: 'If you already came home, forgive me. Some days are missing.' }
    ],
    after: 'There is no choice this time. Only the next message.'
  },
  {
    id: 'memory-fade',
    type: 'fade',
    title: 'Memory Fade',
    mood: 'void',
    icon: '◌',
    instruction: 'Click the fading memories before they disappear.',
    fragments: [
      'Her hand on your shoulder at the school gate.',
      'The soup cooling beside an unanswered phone.',
      'A stair creaking after midnight.',
      'The old blanket folded at the hospital window.',
      'A voice saying, Memory is not a courtroom.'
    ],
    after: 'You save what you can. The rest becomes shape, warmth, and guilt.'
  },
  {
    id: 'last-message',
    type: 'typing',
    title: 'The Message That Cannot Leave',
    mood: 'void',
    icon: '❤',
    instruction: 'Type what you wish you had said.',
    incoming: [
      { who: 'Mom', text: 'Hi sweetheart.' },
      { who: 'Mom', text: 'Are you free to talk tonight?' },
      { who: 'Mom', text: 'I kept the blanket. It still smells like the grass.' },
      { who: 'Mom', text: 'If you find the note in the stairs, do not hate yourself. Memory is not a courtroom.' }
    ],
    placeholder: 'Type what you wish you said...',
    fail: 'Message could not be delivered. Or maybe it already was.'
  },
  {
    id: 'before-grave',
    type: 'pause',
    title: 'Before You Enter',
    mood: 'grave',
    icon: '☾',
    instruction: 'No gameplay. Just breathe before the next scene.',
    lines: [
      'The screen does not change for a moment.',
      'No message arrives.',
      'No typing dots appear.',
      'Only wind, and the feeling that the story has stopped protecting you.',
      'When you continue, you will already know where you are going.'
    ]
  },
  {
    id: 'grave',
    type: 'grave',
    title: 'Ten Years Later',
    mood: 'grave',
    icon: '✿',
    epitaph: 'Beloved Mother. Keeper of little stars.',
    lines: [
      'Sorry it took me so long to visit.',
      'Or maybe I came before. I do not know anymore.',
      'Work got busy. That is what I kept telling people.',
      'I still make your soup. It is never right.',
      'I brought your blanket.',
      'I thought keeping it would mean I kept you.',
      'But sometimes your voice sounds less like a memory and more like a witness.',
      'If I came home and forgot, I am sorry.',
      'If I never came home, I am sorry for that too.',
      'I do not know which version hurts less.'
    ],
    reveal: 'The stone says she died three days after the missed call. The recovered photo says otherwise: your shoes by the door, the blanket on the stairs, and your mother smiling at someone just outside the frame.'
  },
  {
    id: 'ending',
    type: 'ending-stars',
    title: 'One More Star',
    mood: 'stars',
    icon: '★',
    instruction: 'Count the stars one last time. Someone is counting with you.',
    target: 5,
    dialogue: [
      { who: 'Daughter', text: 'Daddy? Why are you crying?' },
      { who: 'You', text: 'Because I do not know if I failed her, or if I forgot that I tried.' },
      { who: 'Daughter', text: 'Is Grandma in the stars?' },
      { who: 'You', text: 'No. She is in the things she repeated until they became part of me.' },
      { who: 'Mom', text: 'The one that is trying its best.' },
      { who: 'You', text: 'That is the dragon.' },
      { who: 'Daughter', text: 'You are making that up.' },
      { who: 'You', text: 'Maybe. That is what memories are.' },
      { who: 'Daughter', text: 'Will you remember this?' },
      { who: 'You', text: 'I will try so hard it becomes a star.' }
    ],
    final: [
      'One day, the people who love you become memories.',
      'One day, you become someone else’s memory.',
      'The truth may blur, but love leaves fingerprints.',
      'Make yours gentle.'
    ]
  }
]

const starPositions = [
  [14, 22], [25, 42], [38, 18], [49, 54], [61, 29], [73, 44], [84, 24],
  [18, 69], [34, 78], [55, 72], [76, 70], [88, 58]
]

function App() {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const chapter = chapters[index]

  const next = () => {
    if (index >= chapters.length - 1) {
      setStarted(false)
      setIndex(0)
    } else {
      setIndex(index + 1)
    }
  }

  const scene = useMemo(() => {
    if (!started) return null
    const props = { chapter, next }
    switch (chapter.type) {
      case 'voicemail': return <Voicemail {...props} />
      case 'face': return <FaceScene {...props} />
      case 'phone': return <PhoneScene {...props} />
      case 'stars': return <StarScene {...props} />
      case 'stairs': return <StairsScene {...props} />
      case 'call-choice': return <CallChoice {...props} />
      case 'fade': return <MemoryFade {...props} />
      case 'typing': return <TypingScene {...props} />
      case 'pause': return <PauseScene {...props} />
      case 'grave': return <GraveScene {...props} />
      case 'ending-stars': return <EndingStars {...props} />
      default: return null
    }
  }, [started, chapter, index])

  return (
    <main className={`app mood-${chapter?.mood || 'warm'}`}>
      <Ambient />
      <section className="stage">
        {!started ? <StartScreen onStart={() => setStarted(true)} /> : <div className="chapter-shell" key={chapter.id}>{scene}<Progress index={index} /></div>}
      </section>
    </main>
  )
}

function Ambient() {
  return <div className="ambient"><div className="glow" />{Array.from({ length: 80 }).map((_, i) => <span key={i} className="ambient-star" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 61) % 100}%`, animationDelay: `${i * 0.04}s` }} />)}<div className="vignette" /></div>
}

function StartScreen({ onStart }) {
  return <div className="start-screen fade-in"><div className="title-icon">☎</div><h1>One More Call</h1><p>An emotional minimalist story game about old messages, fading memories, a hidden stair note, and the impossible question: did you fail her, or did you forget that you tried?</p><button className="primary-btn" onClick={onStart}>Start</button><small>Play slowly. Every click is a memory choosing whether to stay.</small></div>
}

function Card({ chapter, children, wide = false }) {
  return <div className={`card ${wide ? 'wide' : ''}`}><Header chapter={chapter} />{children}</div>
}
function Header({ chapter }) {
  return <header className="header"><div className="scene-icon">{chapter.icon}</div><h2>{chapter.title}</h2>{chapter.instruction && <p>{chapter.instruction}</p>}</header>
}
function Action({ children, onClick, disabled, variant = 'primary' }) {
  return <button className={`action ${variant}`} disabled={disabled} onClick={onClick}>{children}</button>
}
function Progress({ index }) {
  return <div className="progress">{chapters.map((c, i) => <span key={c.id} className={i <= index ? 'active' : ''} />)}</div>
}

function Voicemail({ chapter, next }) {
  const [step, setStep] = useState(0)
  const done = step >= chapter.lines.length
  return <Card chapter={chapter}><div className="center"><div className="pulse-circle">☎</div>{chapter.lines.slice(0, step).map(line => <p className="quote" key={line}>“{line}”</p>)}{done && <p className="caption">{chapter.after}</p>}</div>{!done ? <Action onClick={() => setStep(step + 1)}>Play Next Line</Action> : <Action onClick={next}>Open Memory</Action>}</Card>
}

function FaceScene({ chapter, next }) {
  const [step, setStep] = useState(0)
  const [locked, setLocked] = useState(false)
  const beat = chapter.beats[Math.max(0, step - 1)]
  const done = step >= chapter.beats.length
  useEffect(() => {
    if (beat?.pause) {
      setLocked(true)
      const t = setTimeout(() => setLocked(false), beat.pause)
      return () => clearTimeout(t)
    }
  }, [beat])
  return <Card chapter={chapter} wide><div className="face-panel"><div className="portraits"><div className="portrait"><div className="avatar mom" /><b>Mom</b><span>warm voice, tired eyes</span></div><div className="portrait right"><div className="avatar child" /><b>You</b><span>younger than you remember</span></div></div><Dialogue beat={step === 0 ? { stage: 'The memory waits for your click.' } : beat} /></div>{done ? <Action onClick={next}>Let The Memory Fade</Action> : <Action disabled={locked} onClick={() => setStep(step + 1)}>{locked ? '...' : 'Continue'}</Action>}</Card>
}
function Dialogue({ beat }) {
  if (!beat) return null
  return <div className="dialogue fade-in">{beat.stage ? <p className="stage-line">{beat.stage}</p> : <><small>{beat.who}</small><p>“{beat.text}”</p></>}</div>
}

function PhoneScene({ chapter, next }) {
  const [count, setCount] = useState(0)
  const [reply, setReply] = useState(null)
  const listRef = useRef(null)
  const all = count >= chapter.messages.length
  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight }, [count, reply])
  return <Card chapter={chapter}><div className="phone-top"><span /></div><div className="phone-window" ref={listRef}>{chapter.messages.slice(0, count).map((m, i) => <Bubble key={`${m.who}-${i}`} msg={m} />)}{!all && <div className="typing">...</div>}{all && chapter.choices && !reply && <div className="choice-stack">{chapter.choices.map(c => <Action key={c} variant="ghost" onClick={() => setReply(c)}>Send: {c}</Action>)}</div>}{reply && <Bubble msg={{ who: 'You', text: reply }} />}{all && (!chapter.choices || reply) && <p className="system">{chapter.after}</p>}</div>{!all ? <Action onClick={() => setCount(count + 1)}>Tap Message</Action> : chapter.choices && !reply ? <Action disabled>Choose A Reply</Action> : <Action onClick={next}>Continue</Action>}</Card>
}
function Bubble({ msg }) {
  if (msg.who === 'System') return <p className="system">{msg.text}</p>
  const mine = msg.who === 'You'
  return <div className={`bubble-row ${mine ? 'mine' : ''}`}><div className={`bubble ${mine ? 'mine' : ''}`}>{!mine && <small>{msg.who}</small>}{msg.text}</div></div>
}

function StarScene({ chapter, next }) {
  const [found, setFound] = useState([])
  const done = found.length >= chapter.target
  const txt = chapter.lines[Math.max(0, found.length - 1)]
  return <Card chapter={chapter} wide><div className="star-field">{starPositions.map(([x, y], i) => <button key={i} className={`star ${found.includes(i) ? 'lit' : ''}`} disabled={found.includes(i) || done} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => setFound([...found, i])} />)}<div className="star-text"><small>Stars counted: {Math.min(found.length, chapter.target)} / {chapter.target}</small>{found.length === 0 && <p className="muted">Start with any star. She will count with you.</p>}{found.length > 0 && <p>“{txt}”</p>}</div></div>{!done ? <Action disabled>Find {chapter.target - found.length} More Star{chapter.target - found.length === 1 ? '' : 's'}</Action> : <Action onClick={next}>{chapter.after}</Action>}</Card>
}

function StairsScene({ chapter, next }) {
  const [step, setStep] = useState(0)
  const [hidden, setHidden] = useState(false)
  const done = step >= chapter.steps.length
  return <Card chapter={chapter} wide><div className="stairs-panel">{chapter.steps.map((s, i) => { const visible = i < step; const loose = i === 4; return <button key={s} disabled={!visible || hidden || !loose} onClick={() => setHidden(true)} className={`stair ${visible ? 'visible' : ''} ${visible && loose && !hidden ? 'loose' : ''}`}>{s}{visible && loose && !hidden && <em>Loose board. Click to lift.</em>}</button> })}{hidden && <div className="hidden-note fade-in">“{chapter.hidden}”</div>}{done && <p className="muted center-text">{chapter.after}</p>}</div>{!done ? <Action onClick={() => setStep(step + 1)}>Climb One Step</Action> : !hidden ? <Action variant="ghost" onClick={next}>Leave The House</Action> : <Action onClick={next}>Carry The Note</Action>}</Card>
}

function CallChoice({ chapter, next }) {
  const [step, setStep] = useState(0)
  const [outcome, setOutcome] = useState(null)
  const ready = step >= chapter.rings.length - 1
  return <Card chapter={chapter}><div className="center"><div className={`call-circle ${!outcome && step > 0 ? 'ringing' : ''}`}>☎</div><p className="big-line">{outcome || chapter.rings[Math.min(step, chapter.rings.length - 1)]}</p></div>{!outcome && !ready && <Action onClick={() => setStep(step + 1)}>Let It Ring</Action>}{!outcome && ready && <div className="choice-stack">{chapter.choices.map(c => <Action key={c.label} variant={c.label === 'Answer' ? 'primary' : 'ghost'} onClick={() => setOutcome(c.result)}>{c.label}</Action>)}</div>}{outcome && <Action onClick={next}>Continue</Action>}</Card>
}

function MemoryFade({ chapter, next }) {
  const [saved, setSaved] = useState([])
  const done = saved.length === chapter.fragments.length
  return <Card chapter={chapter} wide><div className="fade-panel">{chapter.fragments.map((f, i) => { const ok = saved.includes(i); return <button key={f} disabled={ok} className={`fade-memory ${ok ? 'saved' : ''}`} onClick={() => setSaved([...saved, i])}>{ok ? `Remembered: ${f}` : f}</button> })}</div>{!done ? <Action disabled>Save {chapter.fragments.length - saved.length} Fading Memor{chapter.fragments.length - saved.length === 1 ? 'y' : 'ies'}</Action> : <Action onClick={next}>{chapter.after}</Action>}</Card>
}

function TypingScene({ chapter, next }) {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const [failed, setFailed] = useState(false)
  return <Card chapter={chapter}><div className="typing-panel">{chapter.incoming.slice(0, count).map((m, i) => <Bubble key={`${m.text}-${i}`} msg={m} />)}{count < chapter.incoming.length ? <Action onClick={() => setCount(count + 1)}>Read Message</Action> : <><textarea value={text} onChange={e => setText(e.target.value)} placeholder={chapter.placeholder} />{!failed ? <Action disabled={!text.trim()} onClick={() => setFailed(true)}>Send</Action> : <div className="send-fail"><p>{chapter.fail}</p><Action onClick={next}>Ten Years Later</Action></div>}</>}</div></Card>
}

function PauseScene({ chapter, next }) {
  const [step, setStep] = useState(0)
  const done = step >= chapter.lines.length
  return <Card chapter={chapter} wide><div className="pause-panel"><p className="fade-in" key={step}>{done ? 'Take a breath. The next click is the grave.' : chapter.lines[step]}</p></div>{!done ? <Action onClick={() => setStep(step + 1)}>Stay A Moment</Action> : <Action onClick={next}>Continue</Action>}</Card>
}

function GraveScene({ chapter, next }) {
  const [step, setStep] = useState(0)
  const [reveal, setReveal] = useState(false)
  const done = step >= chapter.lines.length
  return <Card chapter={chapter} wide><div className="grave-panel"><div className="stone-side"><div className="flower">✿</div><div className="stone"><b>MOM</b><small>{chapter.epitaph}</small>{reveal && <em>Date conflict</em>}</div><div className="base" /></div><div className="grave-text">{step === 0 && <p className="muted">You sit beside her grave. The wind is quiet.</p>}{chapter.lines.slice(0, step).map(line => <p key={line}>“{line}”</p>)}{reveal && <div className="reveal fade-in">{chapter.reveal}</div>}</div></div>{!done ? <Action onClick={() => setStep(step + 1)}>Sit A Little Longer</Action> : !reveal ? <Action onClick={() => setReveal(true)}>Check The Recovered Photo</Action> : <Action onClick={next}>Look Up</Action>}</Card>
}

function EndingStars({ chapter, next }) {
  const [found, setFound] = useState([])
  const [final, setFinal] = useState(false)
  const done = found.length >= chapter.target
  return <Card chapter={chapter} wide><div className="star-field">{starPositions.map(([x, y], i) => <button key={i} className={`star ${found.includes(i) ? 'lit' : ''}`} disabled={found.includes(i) || done} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => setFound([...found, i])} />)}<div className="star-text ending-text"><small>Stars counted: {Math.min(found.length, chapter.target)} / {chapter.target}</small>{done && !final && chapter.dialogue.map(d => <p key={`${d.who}-${d.text}`}><b>{d.who}:</b> {d.text}</p>)}{final && chapter.final.map(line => <p key={line} className="final-line">{line}</p>)}</div></div>{!done ? <Action disabled>Find {chapter.target - found.length} More Star{chapter.target - found.length === 1 ? '' : 's'}</Action> : !final ? <Action onClick={() => setFinal(true)}>Hold The Story</Action> : <Action onClick={next}>Play Again</Action>}</Card>
}

export default App