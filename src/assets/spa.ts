
/*
 * Copyright (c) Cynthia Rey, All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

type Page = {
  title: string
  meta: HTMLMetaElement[]
  contents: HTMLElement
}

let cache: Record<string, Page> = {}

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
  let page = cache[e.target.href]
  if (!page) {
    document.body.classList.add('loading')
    let timeout = setTimeout(() => location.reload(), 10e3)
    page = await loadPage(e.target.href)
    cache[e.target.href] = page
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
document.addEventListener('DOMContentLoaded', () => {
  cache[location.href] = {
    title: document.title,
    meta: Array.from(document.querySelectorAll('meta')),
    contents: document.getElementById('page-contents')!.cloneNode(true) as HTMLElement,
  }
})

export {}
