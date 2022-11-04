import logo from './logo.svg';
import React from 'react';
import './App.css';
import Title from "./components/Title";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};


const Form = ({updateMainCat}) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) {
    const userValue = e.target.value;

    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    }
    setValue(e.target.value.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    setErrorMessage("");
    if (value === "") {
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        value={value}
        placeholder="영어 대사를 입력해주세요"
        onChange={handleInputChange}
      />
      <button type="submit">생성2</button>
      <p style={{color: "red"}}>{errorMessage}</p>
    </form>
  )
}

function CatItem(props) {
  return (
    <li>
      <img src={props.img}/>
    </li>
  );
}

function MainCard({img, onHeartClick, isFavorite}) {

  const heartIcon = isFavorite ? "❤️" : "🤍";

  return (
    <div className="main-card">
      <img
        src={img}
        alt="고양이"
        width="400"
      />
      <button
        onClick={onHeartClick}
      >
        {heartIcon}
      </button>
    </div>
  );
}

function Favorites({favorites}) {

  return (
    <ul className="favorites">
      {favorites.map(cat => <CatItem img={cat} key={cat}/>)}
    </ul>
  );
}

const App = () => {

  const CAT = "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F2461E64652DF6B0F33";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem('counter');
  });
  const [mainCat, setMainCat] = React.useState(CAT);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem('favorites') || [];
  });

  const isFavorites = favorites.includes(mainCat);

  async function setInitialCat() {
    const newCat = await fetchCat("Hello");
    setMainCat(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  // setInitialCat();

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }


  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setMainCat(newCat);
    const nextCounter = counter + 1;
    setCounter(nextCounter);
    jsonLocalStorage.setItem("counter", nextCounter);
  }

  const counterTitle = counter === null ? '' : counter + '번째';

  return (
    <div>
      <Title>{counterTitle} 고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat}/>
      <MainCard
        onHeartClick={handleHeartClick}
        img={mainCat}
        isFavorite={isFavorites}
      />
      <Favorites favorites={favorites}/>
    </div>
  );
}

export default App;
