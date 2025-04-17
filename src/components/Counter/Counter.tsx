import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { decrement, increment } from "../../state/counter/counterSlice";

const Counter = () => {
  const count = useSelector((state: RootState) => state.value);
  const dispatch = useDispatch();

  return (
    <div style={{ color: "white" }}>
      <h2>{count}</h2>
      <div>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
      </div>
    </div>
  );
};

export default Counter;
