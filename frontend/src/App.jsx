import { useRef, useState } from 'react';
import GameBoard from './GameBoard.jsx';

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
            <label>Name</label>
            <input
              placeholder={'name'}
              onChange={(e) => (name.current = e.target.value)}
            />
          </div>
          <div>
            <label>Pick Color</label>
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
          <div>
            {isLoading && (
              <table>
                <thead>
                  <tr>
                    <th>time</th>
                    <th>player0</th>
                    <th>player0_area</th>
                    <th>player1</th>
                    <th>player1_area</th>
                    <th>winner</th>
                    <th>loser</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td>{item.time}</td>
                      <td>{item.player0}</td>
                      <td>{item.player0_area}</td>
                      <td>{item.player1}</td>
                      <td>{item.player1_area}</td>
                      <td>{item.winner}</td>
                      <td>{item.loser}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
