/*
 * Copyright (c) 2021-2023 Cynthia Rey, All rights reserved.
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

import type { AstroIntegration, AstroConfig } from 'astro'
import { relative, basename, extname } from 'path'
import sharp from 'sharp'

const HANDLE_RE = /__PLACEHOLDER_IMAGE_([^_]+)__/g
const IMAGE_RE = /\.(heic|heif|avif|jpeg|jpg|png|tiff|webp|gif)\?preprocess$/
const IMAGE_MAX_WIDTH = 700
const IMAGE_MAX_HEIGHT = 550

let config: AstroConfig

async function loadImage (path: string) {
  const img = sharp(path)
  const meta = await img.metadata()
  return sharp(path)
    .webp({ quality: 85 })
    .resize({
      width: Math.min(meta.width || Infinity, IMAGE_MAX_WIDTH),
      height: Math.min(meta.height || Infinity, IMAGE_MAX_HEIGHT),
      fit: 'inside',
    })
}

function imgPlugin (): Exclude<AstroConfig['vite']['plugins'], undefined>[number] {
  let prod = false

  return {
    name: '@cynthia/image',
		enforce: 'pre',
    configResolved (cfg) {
      prod = cfg.mode === 'production'
    },
    async load (id) {
      if (!IMAGE_RE.test(id)) return

      const imgPath = new URL(id, 'file://').pathname
      if (prod) {
        const file = await loadImage(imgPath)
        const rawName = basename(imgPath)
        const handle = this.emitFile({
          name: rawName.replace(extname(rawName), '.webp'),
          source: await file.toBuffer(),
          type: 'asset',
        })

        return `export default __PLACEHOLDER_IMAGE_${handle}__`
      }

      const path = relative(config.srcDir.pathname, imgPath)
      return `export default "/@dev/images/${path}"`
    },
    configureServer (server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/@dev/images/')) {
          const [, path] = req.url.split('/@dev/images/')
          const file = new URL(path!, config.srcDir)
          return loadImage(file.pathname).then((i) => i.pipe(res))
        }

        return next()
      })
    },
    renderChunk (code) {
      for (const match of code.matchAll(HANDLE_RE)) {
        code = code.replace(match[0], JSON.stringify(this.getFileName(match[1]!)))
      }

      return {
        code: code
      }
    }
  }
}

export default function image (): AstroIntegration {
  return {
    name: 'image',
    hooks: {
      'astro:config:setup': (ctx) => {
        ctx.updateConfig({
          vite: {
            plugins: [
              imgPlugin(),
            ],
          },
        })
      },
      'astro:config:done': (ctx) => {
        config = ctx.config
      },
    },
  }
}
