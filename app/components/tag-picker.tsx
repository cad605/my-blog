import { useFetcher, useSearchParams } from 'remix'
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox'
import { Tag } from '@prisma/client'
import { useState } from 'react'

export default function TagPicker() {
  const selectedTags = useState([])
  // Set up a fetcher to fetch languages as the user types
  const tags = useFetcher<Tag[]>()

  // ComboboxInput is just an <input/> in the end, so we can read the submitted
  // value from the search params when we submit the form (because it's a "get"
  // form instead of "post", it will be in the URL as a search param).
  const [searchParams] = useSearchParams()

  return (
    <div>
      <label className="block text-xl text-zinc-800 font-medium" htmlFor="tags">
        Tags:
      </label>
      <Combobox>
        <ComboboxInput
          id="tags"
          name="tags"
          onChange={e => {
            // When the input changes, load the tags
            tags.load(`/blog/tag-search?q=${e.target.value}`)
          }}
        />

        {/* Add a nice spinner when the fetcher is loading */}
        {tags.state === 'loading' && 'Searching...'}

        {/* Only show the popover if we have results */}
        {tags.data && (
          <ComboboxPopover>
            <ComboboxList>
              {tags.data.map(tag => (
                <ComboboxOption key={tag.id} value={tag.id.toString()}>
                  {tag.name}
                </ComboboxOption>
              ))}
            </ComboboxList>
            <p style={{ textAlign: 'center', padding: 10 }}>
              <button>Create a new record</button>
            </p>
          </ComboboxPopover>
        )}
      </Combobox>
    </div>
  )
}
