export function ErrorMessage({ text }: { text: string }) {
  return text ? <div role="alert" className="error error-state"><span aria-hidden="true">!</span><p>{text}</p></div> : null
}
