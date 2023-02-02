import styles from "./Tracker.module.css";
import icon from "../assets/images/icon-arrow.svg";
import useFetch from "../hooks/useFetch";
import axios from "axios";

function Form({ handleSubmit, search, setSearch }) {
  return (
    <form className={styles.inputGroup} onSubmit={handleSubmit}>
      <input
        type="search"
        className={styles.search}
        name="search"
        placeholder="Search for any IP address or domain"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className={styles.submit}>
        <img src={icon} alt="Icon" className={styles.icon} />
      </button>
    </form>
  );
}

function Info({ ip, location, isp }) {
  const lc = `${location.region}, ${location.country}`;
  const tz = `UTC ${location.timezone}`;
  return (
    <ul className={styles.info}>
      <InfoCategory title="Ip Address" content={ip} />
      <InfoCategory title="Location" content={lc} />
      <InfoCategory title="Timezone" content={tz} />
      <InfoCategory title="Isp" content={isp} />
    </ul>
  );
}

function InfoCategory({ title, content }) {
  return (
    <li className={styles.infoItem}>
      <span className={styles.title}>{title}</span>
      <div className={styles.text}>{content}</div>
    </li>
  );
}

function checkInputType(string) {
  /*
  Helper function that takes a string as input and returns
  "ip address" or "domain name" if it matches the corresponding regex
  false if no regex matches or string length > 254*/
  if (string.length > 254) {
    return false;
  }

  let numField = "(0|[1-2][0-9]([0-5]|(?<!2[5-9])[6-9])|[1-9][0-9]?)";
  let ipRegex = new RegExp(`^(${numField}\\.){3}${numField}$`);
  if (ipRegex.test(string)) {
    return "ip";
  }

  let domainRegex =
    /^(https?:\/\/)?(www\.)?([a-z0-9]{1}[a-z0-9-]{0,62}\.){1,2}[a-z]{2,63}$/i;
  if (domainRegex.test(string)) {
    return "domain";
  }

  return false;
}

function Tracker({ info, setInfo }) {
  /* Getting client ip with custom fetch hook */
  const [search, setSearch, loading, setLoading, error, setError] = useFetch(
    "https://api.ipify.org?format=json"
  );

  function handleSubmit(e) {
    e.preventDefault();

    /*Setting fetch values to default */
    setLoading(null);
    setError(null);
    setSearch("");

    /* Checking search parameter to if its domain or ip address */
    let options = "";

    if (checkInputType(search) === "ip") {
      options = `&ipAddress=${search}`;
    } else if (checkInputType(search) === "domain") {
      options = `&domain=${search}`;
    } else {
      alert("Please enter a valid Domain name or IP Address!!!");
      return;
    }

    /* while getting response through request call setting loading to true and getting response if its error setting error value if its not setting info object */
    setLoading(true);
    axios
      .get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${
          import.meta.env.VITE_API_KEY
        }${options}`
      )
      .then((response) => setInfo(response.data))
      .catch((e) => setError(e.message))
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className={styles.tracker}>
      {loading && <h1 className={styles.heading}>Loading...</h1>}
      {!loading && error !== null && <h1 className={styles.error}>{error}</h1>}
      {!loading && (
        <>
          {error === null && (
            <h1 className={styles.heading}>IP Address Tracker</h1>
          )}
          <Form
            handleSubmit={handleSubmit}
            search={search}
            setSearch={setSearch}
          />
          {error === null && info.ip.length > 0 && <Info {...info} />}
        </>
      )}
    </div>
  );
}

export default Tracker;
