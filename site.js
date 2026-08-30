(async function () {
  const state = { manifest: null, config: null }
  const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text }
  const setLink = (id, url) => { const el = document.getElementById(id); if (!el) return; if (url && /^https:\/\//i.test(url)) { el.href = url; el.classList.remove('disabled'); } else { el.removeAttribute('href'); el.classList.add('disabled'); } }
  try {
    const [config, manifest] = await Promise.all([
      fetch('./release.config.json').then((res) => res.ok ? res.json() : null),
      fetch('./update/latest.json').then((res) => res.ok ? res.json() : null),
    ])
    state.config = config
    state.manifest = manifest
    if (manifest?.version) {
      setText('version', `当前版本 v${manifest.version}`)
      setText('release-date', manifest.releaseDate || '')
      setLink('download', manifest.downloadUrl)
      setLink('release-page', manifest.releasePage)
      setLink('changelog', manifest.changelogUrl || 'update.html')
      const notes = document.getElementById('notes')
      if (notes && Array.isArray(manifest.notes)) notes.innerHTML = manifest.notes.slice(0, 4).map((note) => `<li>${String(note)}</li>`).join('') || '<li>首个内部试用版本。</li>'
    }
    const github = config?.github
    if (github?.owner && github?.repo) setLink('github', `https://github.com/${github.owner}/${github.repo}`)
  } catch { setText('version', '当前版本信息暂不可用') }
})()
