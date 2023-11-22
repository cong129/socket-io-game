import { useRef, useState } from 'react';
import GameBoard from './GameBoard.jsx';
import { ShowTable } from './ShowTable.jsx';

export const App = () => {
  const color = useRef();
  const name = useRef();
  const [playing, setPlaying] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/history');
      const result = await response.json(); // JSON 형식으로 파싱합니다.
      console.log(result); // 실제 데이터 확인
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      {!playing && (
        <div className="login">
          <h1>Painting Game</h1>
          <div>
            <label>Name:</label>
            <input
              placeholder={'name'}
              onChange={(e) => (name.current = e.target.value)}
            />
          </div>
          <div>
            <label>Pick Color:</label>
            <input
              type={'color'}
              onChange={(e) => (color.current = e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => {
                if (name.current !== undefined && color.current !== undefined) {
                  setPlaying(true);
                }
              }}
            >
              PLAY!
            </button>
          </div>
          <div>
            <button onClick={fetchData}>Load History</button>
          </div>
          <div>{isLoading && <ShowTable data={data} />}</div>
        </div>
      )}
      {playing && (
        <div>
          <GameBoard name={name.current} color={color.current} />
        </div>
      )}
    </div>
  );
};
export default App;
