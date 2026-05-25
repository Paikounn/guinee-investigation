export async function exportToSVG(wrapper: HTMLElement | null, caseTitle: string) {
  if (!wrapper) return

  const flowRenderer = wrapper.querySelector('.react-flow__renderer') as HTMLElement | null
  if (!flowRenderer) return

  const svgEl = flowRenderer.querySelector('svg')
  if (!svgEl) return

  const nodes = wrapper.querySelectorAll('.react-flow__node')
  const foreignObjects: SVGForeignObjectElement[] = []

  nodes.forEach((node) => {
    const el = node as HTMLElement
    const rect = el.getBoundingClientRect()
    const wrapperRect = wrapper.getBoundingClientRect()

    const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    fo.setAttribute('x', String(rect.left - wrapperRect.left))
    fo.setAttribute('y', String(rect.top - wrapperRect.top))
    fo.setAttribute('width', String(rect.width))
    fo.setAttribute('height', String(rect.height))

    const div = document.createElement('div')
    div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
    div.innerHTML = el.innerHTML
    fo.appendChild(div)
    foreignObjects.push(fo)
  })

  const clone = svgEl.cloneNode(true) as SVGElement
  foreignObjects.forEach((fo) => clone.appendChild(fo))

  const bbox = svgEl.getBoundingClientRect()
  clone.setAttribute('width', String(bbox.width))
  clone.setAttribute('height', String(bbox.height))
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  const serialized = new XMLSerializer().serializeToString(clone)
  const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `investigation-${caseTitle.replace(/\s+/g, '-')}-${Date.now()}.svg`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}