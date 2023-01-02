type Page = {
  title: string
  meta: HTMLMetaElement[]
  contents: HTMLElement
}

let cache = new Map<string, Page>()

let loadPage = (url: string): Promise<Page> => {
  return fetch(url)
    .then((r) => r.text())
    .then((html) => {
      let dummy = document.createElement('html')
      dummy.innerHTML = html

      dummy.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]').forEach((css) => {
        if (!document.head.querySelector(`link[href=${JSON.stringify(css.href)}]`)) {
          document.head.appendChild(css)
        }
      })

      return {
        title: dummy.querySelector('title')!.innerText,
        meta: Array.from(dummy.querySelectorAll('meta')),
        contents: dummy.querySelector('#page-contents')!,
      }
    })
}

let clickHandler = async (e: MouseEvent) => {
  if (!(e.target instanceof HTMLAnchorElement)) return
  if (e.target.host !== location.host) return

  e.preventDefault()
  history.pushState(null, document.title, e.target.href)
  let page = cache.get(e.target.href)
  if (!page) {
    document.body.classList.add('loading')
    let timeout = setTimeout(() => location.reload(), 10e3)
    page = await loadPage(e.target.href)
    cache.set(e.target.href, page)
    clearTimeout(timeout)
    document.body.classList.remove('loading')
  }

  document.title = page.title
  const container = document.getElementById('page-contents')!

  document.querySelectorAll('meta').forEach((m) => m.remove())
  document.head.append(...page.meta)
  container.replaceWith(page.contents.cloneNode(true))
  document.scrollingElement!.scrollTop = 0
}

document.addEventListener('click', clickHandler)

export {}
