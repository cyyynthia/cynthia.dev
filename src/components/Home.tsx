/*
 * Copyright (c) 2020 Cynthia K. Rey, All rights reserved.
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

import { h } from 'preact'
import type { ComponentChild } from 'preact'
import type { RoutableProps } from 'preact-router'

import avatar from '@assets/avatar.png'
import style from '@styles/home.scss'

interface SectionProps {
  title: string
  children: ComponentChild
}

function Section (props: SectionProps) {
  return (
    <section className={style.section}>
      <h3 className={style.title}>{props.title}</h3>
      {props.children}
    </section>
  )
}

function Home (_: RoutableProps) {
  return (
    <div className={style.container}>
      <div className={style.headerWrapper}>
        <header className={style.header}>
          <img src={avatar} alt='Avatar'/>
          <div>
            <span className={style.title}>Hi 👋, I'm Cynthia 🌹</span>
            <span className={style.subtitle}>Pink-haired french gal turning coffee into spaghet</span>
          </div>
        </header>
      </div>

      <div className={style.content}>
        <Section title='About me'>
          <p>
            Born and raised in Toulouse, France, I'm a 19 years old enthusiast spending her free time writing pieces
            of software, always with a cup of coffee and my cookies nearby. {/* You can give a look to the projects I'm
            working on <a href='/projects'>here</a>. */}
          </p>
          <p>
            I write most of my code in JavaScript (mostly TypeScript actually), and the rest in Rust when I need
            speedy code or when I want/need to end up with a single-file executable. {/* If you want more details about
            my skill-set, you can still give a look to my <a href='/resume'>resume</a>. */}
          </p>
          <p>
            I go by the pronouns of she/her.
          </p>
        </Section>
        <Section title='Contact me'>
          <p>
            If you want to contact me, feel free to shoot me an email! I'll be more than happy to reply. You can even
            encrypt your email using PGP, if you're into that kind of things.
          </p>
          <ul>
            <li><b>Email:</b> cynthia@cynthia.dev</li>
            <li><b>PGP:</b> <code>FDDF 5DD9 34DC 5814 6C8B  3E8B CB56 1F74 DCEA E23B</code></li>
          </ul>
          <p>
            For business inquires, use my professional email instead:
          </p>
          <ul>
            <li><b>Email:</b> cyyynthia@borkenware.com</li>
            <li><b>PGP:</b> <code>DF55 8861 7AE5 D4F2 1C4E  FE44 4C40 E92C CFA6 1C34</code></li>
          </ul>
        </Section>
        <Section title='Pay me a coffee'>
          <p>
            Feeling generous? You can <a href='https://ko-fi.com/cyyynthia'>pay me a coffee</a>, to help me stay
            caffeinated!
          </p>
        </Section>
      </div>
    </div>
  )
}

Section.displayName = 'Section'
Home.displayName = 'Home'
export default Home
