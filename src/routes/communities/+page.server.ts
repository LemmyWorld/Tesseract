import { getClient } from '$lib/lemmy.js'
import type { ListingType } from 'lemmy-js-client'

export function load({ url, cookies }) {
  const type = url.searchParams.get('listingType') as ListingType
  const page = Number(url.searchParams.get('page')) || 1
  const query = url.searchParams.get('q')

  if (query) {
    return getClient(cookies.get('instance_url')).search({
      limit: 40,
      page: page,
      sort: 'Active',
      type_: 'Communities',
      listing_type: type,
      q: query,
    })
  } else {
    return getClient(cookies.get('instance_url')).listCommunities({
      limit: 40,
      page: page,
      sort: 'Active',
      type_: type,
    })
  }
}
