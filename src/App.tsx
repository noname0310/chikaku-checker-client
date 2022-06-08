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

async function requestEvaluationResult(text: string): Promise<string> {
    const url = `http://127.0.0.1:8080/?text=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const json = await response.json() as { result: string };
    return json.result;
}

function App(): JSX.Element {
    const [text, setText] = useState("");

    const debouncedText = useDebounce({ value: text, delay: 1000 });
    
    const [result, setResult] = useState("");
    
    useEffect(() => {
        if (debouncedText == "") return;

        requestEvaluationResult(debouncedText).then(result => {
            setResult(result);
        });
    }, [debouncedText]);

    const inputFieldChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
            setText(e.target.value);
        }, [setText]
    );

    return (
        <MainContainer>
            <Window>
                <Title>글 평가</Title>
                <InputDiv>
                    <TextInput placeholder="Type here..." onInput={inputFieldChange} />
                </InputDiv>
                <Text>괜찮은 글일 확률: {result}</Text>
            </Window>
        </MainContainer>
    );
}

export default App;
