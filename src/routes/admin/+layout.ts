/*
import { profile } from '$lib/auth.js'
import { get } from 'svelte/store'
import { getClient, site as siteStore } from '$lib/lemmy.js'

export async function load({ fetch }) {
  if (!get(profile)) return
  let { jwt } = get(profile)!
  let site = get(siteStore)

  if (!site) {
    const res = await getClient(undefined, fetch).getSite({
      auth: jwt,
    })

    site = res
  }

  return {
    site: site,
  }
}
*/