import './App.css';
import useAxios from 'axios-hooks';
import { ErrorBoundary } from 'react-error-boundary';
import SearchContainer from './components/SearchContainer';
import { useCallback, useEffect, useRef, useState } from 'react';
import DataContainer from './components/DataContainer';
import ErrorMessage from './components/ErrorMessage';
import NoResult from './components/NoResult';

function App() {
  const searchUrl =
    'https://coursetreesearch-service-sandbox.dev.tophat.com/treesearch/';
  const [showResult, setShowResult] = useState<boolean>(false);
  const [{ data, loading, error }, getSearchData] = useAxios(
    {
      url: searchUrl,
    },
    {
      manual: true,
    }
  );

  const [searchValue, setSearchValue] = useState('');

  const errorTime = useRef(0);

  const onSubmit = (value: string) => {
    if (value) {
      getSearchData({ params: { query: value } });
      setSearchValue(value);
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  };

  const renderResultArea = useCallback(() => {
    if (loading) {
      return <div>loading...</div>;
    }
    if (!error && data && data.body) {
      return data.body.length > 0 ? (
        <>
          <ErrorBoundary FallbackComponent={ErrorMessage}>
            <DataContainer data={data.body} />
          </ErrorBoundary>
        </>
      ) : (
        <NoResult />
      );
    }
    // return null;
    return <ErrorMessage error={error} />;

    //Below is mock data for testing purpose only
    // const mockData = [
    //   { id: 5, name: 'Chemical Kinetics', parent_id: 6 },
    //   { id: 3, name: 'Surface Chemistry', parent_id: 1 },
    //   { id: 1, name: 'Lab Experiment 1', parent_id: 0 },
    //   { id: 4, name: 'Lab 1 Summary', parent_id: 1 },
    //   { id: 2, name: 'Colloidal Solution (sol) of Starch', parent_id: 3 },
    //   { id: 6, name: 'Lab Experiment 2', parent_id: 0 },
    //   { id: 7, name: 'Colloidal Solution of Gum', parent_id: 3 },
    // ];
    // return <DataContainer data={mockData} />;
  }, [data, loading, error]);

  useEffect(() => {
    console.log(errorTime.current);
    if (error && errorTime.current <= 1) {
      errorTime.current++;
      getSearchData({ params: { query: searchValue } });
    }
  }, [error]);

  useEffect(() => {
    renderResultArea();
  }, [renderResultArea]);

  return (
    <div className="flex flex-col items-center">
      <SearchContainer onSubmit={onSubmit} />
      <div className="p-10">{showResult && renderResultArea()}</div>
    </div>
  );
}

export default App;
