import axios from "axios";
import { useEffect, useState } from "react";

function useFetch(url) {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setData("");
    setLoading(true);
    axios
      .get(url)
      .then((response) => setData(response.data.ip))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  return [data, setData, loading, setLoading, error, setError];
}

export default useFetch;
