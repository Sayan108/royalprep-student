type Props = { title: string; documentHtml: string; allowScripts?: boolean }

const passivePolicy = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data:; style-src \'unsafe-inline\'; font-src data:; base-uri \'none\'; form-action \'none\'">'

export function SandboxedDocument({ title, documentHtml, allowScripts = false }: Props) {
  return <iframe title={title} sandbox={allowScripts ? 'allow-scripts' : ''} style={{ width: '100%', height: '80vh', border: 0 }} srcDoc={allowScripts ? documentHtml : passivePolicy + documentHtml}/>
}
