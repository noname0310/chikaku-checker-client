import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const MainContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Window = styled.div`
    height: 400px;
    width: 600px;
    background-color: #39C5BB;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
`;

const Title = styled.h1`
    text-align: center;
    color: #ffffff;
    font-family: sans-serif;
`;

const InputDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;
    height: auto;
    width: 80%;
    margin-bottom: 20px;
`;

const TimeInput = styled.input`
    height: 30px;
    width: 150px;
    font-size: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    border: 1px solid #ffffff;
`;

const TextInput = styled.textarea`
    height: 140px;
    width: 100%;
    border: none;
    font-size: 20px;
    resize: none;
    font-family: sans-serif;
    border-radius: 10px;
    padding: 10px;
    box-sizeing: border-box;
`;

const Text = styled.div`
    font-size: 20px;
    width: 400px;
    height: 60px;
    background-color: #3ecec4;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
    border-radius: 10px;
    font-weight: bold;
`;

interface debounceProps<T> {
    value: T;
    delay: number;
}

function useDebounce<T>({ value, delay }: debounceProps<T>): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value]);

    return debouncedValue;
}

async function requestChikakuResult(time: string, text: string): Promise<string> {
    const url = `https://chikaku.herokuapp.com/?time=${time}&text=${text}`;
    const response = await fetch(url);
    const json = await response.json() as { result: string };
    return json.result;
}

function App(): JSX.Element {
    const [text, setText] = useState("");

    const debouncedText = useDebounce({ value: text, delay: 1000 });
    
    const [time, setTime] = useState("");
    const [result, setResult] = useState("");
    
    useEffect(() => {
        if (time == "") return;
        if (debouncedText == "") return;

        requestChikakuResult(time, debouncedText).then(result => {
            setResult(result);
        });
    }, [debouncedText, time]);

    const timeChanged = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            setTime(event.target.value);
        }, [setTime]
    );

    const inputFieldChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
            setText(e.target.value);
        }, [setText]
    );

    return (
        <MainContainer>
            <Window>
                <Title>지각 사유</Title>
                <InputDiv>
                    <TimeInput type="time" value={time} onChange={timeChanged} />
                    <TextInput placeholder="Type here..." onInput={inputFieldChange} />
                </InputDiv>
                <Text>{result}</Text>
            </Window>
        </MainContainer>
    );
}

export default App;
