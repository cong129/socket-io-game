import React, { useEffect, useRef } from 'react';

export const ShowTable = (props) => {
  const { data } = props;
  return (
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
  );
};
