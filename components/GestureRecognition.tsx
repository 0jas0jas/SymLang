'use client';

import { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

const GestureRecognition = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
    const [label, setLabel] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [ifCount, setIfCount] = useState<number>(0);
    const [openAiResult, setOpenAiResult] = useState<string>('');

    useEffect(() => {
        const loadModel = async () => {
            const modelURL = 'https://teachablemachine.withgoogle.com/models/SeosoDTg4/model.json';
            const metadataURL = 'https://teachablemachine.withgoogle.com/models/SeosoDTg4/metadata.json';
            const model = await tmImage.load(modelURL, metadataURL);
            setModel(model);
        };

        loadModel();

        const startVideo = async () => {
            const video = videoRef.current;
            if (video) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.play();
            }
        };

        startVideo();
    }, []);

    useEffect(() => {
        const predict = async () => {
            if (model && videoRef.current) {
                const prediction = await model.predict(videoRef.current);
                const highestPrediction = prediction.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);
                setLabel(highestPrediction.className);

                setCode(prevCode => {
                    switch (highestPrediction.className) {
                        case 'IF THEN ELSE ENDIF':
                            setIfCount(prevCount => {
                                if (prevCount === 0) {
                                    return 1;
                                } else if (prevCount === 1) {
                                    return 2;
                                } else {
                                    return 0;
                                }
                            });
                            if (ifCount === 0) {
                                return prevCode + '\nIF ';
                            } else if (ifCount === 1) {
                                return prevCode + 'ENDIF\n\n';
                            } else {
                                return prevCode + 'THEN ';
                            }
                        case 'NUM1':
                            return prevCode.endsWith('\nLOOP ') ? prevCode + '1\n' : prevCode + '1 ';
                        case 'NUM2':
                            return prevCode.endsWith('LOOP ') ? prevCode + '2\n' : prevCode + '2 ';
                        case 'NUM3':
                            return prevCode.endsWith('LOOP ') ? prevCode + '3\n' : prevCode + '3 ';
                        case 'NUM4':
                            return prevCode.endsWith('LOOP ') ? prevCode + '4\n' : prevCode + '4 ';
                        case 'NUM5':
                            return prevCode.endsWith('LOOP ') ? prevCode + '5\n' : prevCode + '5 ';
                        case 'EQUALS':
                            return prevCode + '= ';
                        case 'XVAR':
                            return prevCode + 'X ';
                        case 'PLUS':
                            return prevCode + '+ ';
                        case 'NOT':
                            return prevCode + 'NOT ';
                        case 'LOOP':
                            return prevCode + '\nLOOP ';
                        case 'PRINT':
                            return prevCode + 'PRINT ';
                        case 'GTHAN':
                            return prevCode + '> ';
                        case 'LTHAN':
                            return prevCode + '< ';

                        default:
                            return prevCode;
                    }
                });

                console.log(`Detected gesture: ${highestPrediction.className}`);
            }
        };

        const interval = setInterval(predict, 3000);
        return () => clearInterval(interval);
    }, [model, ifCount]);

    const handleDelete = () => {
        setCode(prevCode => prevCode.slice(0, -1));
    };

    const handleCompile = async () => {
        const rules = `
        IF THEN ELSE ENDIF, NUM1, NUM2, NUM3, NUM4, NUM5, EQUALS, XVAR, PLUS, NOT, LOOP, PRINT are all the functions available
        return "SYNTAX ERROR" if these rules don't apply in the input
        1. IF THEN ELSE ENDIF: Conditional statement
        2. NUM1, NUM2, NUM3, NUM4, NUM5: Numbers
        3. EQUALS: Assignment operator / Comparison operator
        4. XVAR: Variable (only variable available)
        5. PLUS: Addition operator
        6. NOT: Logical operator / also can be used for MINUS for example 5 PLUS NOT 2 would be equal to 3
        7. LOOP: Loop statement. MUST BE IMMEDIATELY PROCEEDED BY A NUMBER after that one number, repeat the code inside for the number of times specified. Ex: LOOP 5\n PRINT 5 would pr int "5\n5\n5\n5\n5\n"
        8. PRINT: Print the value of the variable or a number
        9. Only return errors in these types: SYNTAX ERROR, RUNTIME ERROR, LOGIC ERROR also tell why the error occured
        10. Return the output when the code is valid. 
        11. The code is valid by default, it's only erronous when the rules are not followed
        12. Different lines in code does not always need to have newline characters
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: `You are a compiler which follows these rules of this language ${rules}.` },
                {
                    role: "user",
                    // content: `Compile and run this code and return it's output/error: \n${code}`,
                    content: `Compile and run this code and return it's output/error. Return the answer without any puntuations, just the output or the error: ${code}`,
                },
            ],
            store: true,
        });
        if (completion.choices[0].message.content) {
            setOpenAiResult(completion.choices[0].message.content);
        }
        console.log(completion.choices[0].message.content);
        console.log('Compiling code...');
        console.log(code);
    };

    return (
        <div className='flex flex-col gap-5 justify-center' >
            <video ref={videoRef} width="640" height="480" autoPlay muted></video>
            <div role="alert" className="alert">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-info h-6 w-6 shrink-0">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {label === 'Empty' ? (
                    <span>Awaiting input...</span>
                ) : (
                    <span>You used {label} command</span>
                )}
            </div>
            <div className="mockup-code">
                <pre data-prefix="$"><code>{code}</code></pre>
                <button className='btn text-xl' onClick={handleDelete}>⌫</button>
            </div>
            {openAiResult === '' ? null :

                <div role="alert" className="alert alert-success">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{openAiResult}</span>
                </div>}
            <div className='flex flex-col items-center gap-4'>
                <button className='btn btn-primary w-32' onClick={handleCompile}>Compile!</button>
            </div>
        </div>
    );
};

export default GestureRecognition;
