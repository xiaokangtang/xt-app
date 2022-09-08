import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface SearchContainerProps {
  onSubmit: (searchValue: string) => void;
}

const SearchContainer = ({ onSubmit }: SearchContainerProps) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchEmpty, setSearchEmpty] = useState<boolean>(false);
  const onInputChange = (e: any) => {
    if (e.target.value) {
      // setSearchValue(e.target.value);
      onSubmit(e.target.value);
      setSearchEmpty(false);
    }
  };
  const debouncedSearch = useDebouncedCallback(
    (value) => onInputChange(value),
    500
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  });

  const onSubmitClick = () => {
    if (!searchValue) {
      setSearchEmpty(true);
    }
    onSubmit(searchValue);
  };

  return (
    <div className="flex flex-col p-10 w-1/2">
      <div className="flex justify-center items-center">
        <div className="flex-1">
          <label className="sr-only" htmlFor="search_input">
            enter text to search
          </label>
          <input
            id="search_input"
            className="rounded-md border p-3 text-16 w-full"
            placeholder="Search"
            onChange={(e) => debouncedSearch(e)}
            type="search"
          />
        </div>

        {/* <button
          className="rounded-md border border-blue-500 h-12 w-20 ml-4"
          onClick={onSubmitClick}>
          Submit
        </button> */}
      </div>
      {searchEmpty && (
        <p aria-live="polite" className="text-sm font-light text-rose-700">
          Please enter some text
        </p>
      )}
    </div>
  );
};

export default SearchContainer;
