import './App.scss';
import ColorCard from './components/ColorCard';
import { useState, useEffect } from 'react';
import { timeout } from './utils/util';

function App() {

    const [isOn, setIsOn] = useState(false);

    const colorList = ["green", "red", "yellow", "blue"]

    const initPlay = {
        isDisplay: false,
        colors: [],
        score: 0,
        userPlay: false,
        userColors: []
    }

    const [play, setPlay] = useState(initPlay);
    const [flashColor, setFlashColor] = useState("");

    
    
    useEffect(() => {
        if (isOn) {
            setPlay({
                ...play,
                isDisplay: true
            });
        } else {
            setPlay(initPlay);
        }
            
    }, [isOn])

    useEffect(() => {
        if (isOn && play.isDisplay) {
            let newColorIndex = Math.floor(Math.random() * 4);
            let newColor = colorList[newColorIndex];
            const copyColors = [...play.colors];
            copyColors.push(newColor);
            setPlay({
                ...play,
                colors: copyColors
            })
        }
    }, [isOn, play.isDisplay])

    useEffect(() => {
        if (isOn && play.isDisplay && play.colors.length) {
            displayColors();
        }
    }, [isOn, play.isDisplay, play.colors.length])


    
    
    
    const displayColors = async () => {
        await timeout(1000);
        for (let index = 0; index < play.colors.length; index++){
            setFlashColor(play.colors[index]);
            await timeout(1000);
            setFlashColor("");
            await timeout(1000);

            if (index === play.colors.length - 1) {
                const copyColors = [...play.colors];

                setPlay({
                    ...play,
                    isDisplay: false,
                    userPlay: true,
                    userColors: copyColors.reverse()
                })
            }
        }
        // play.colors.forEach( async (color, index) => {
        //     setFlashColor(color);
        //     await timeout(1000);
        //     setFlashColor("");
        //     await timeout(1000);

        //     if (index === play.colors.length - 1) {
        //         const copyColors = [...play.colors];

        //         setPlay({
        //             ...play,
        //             isDisplay: false,
        //             userPlay: true,
        //             userColors: copyColors.reverse()
        //         })
        //     }
        // })
    }

    const startHandle = () => {
        setIsOn(true);
    }
    

    const cardClickHandle = async (color) => {
        if (!play.isDisplay && play.userPlay) {
            
            const copyColors = [...play.userColors];
            const lastColor = copyColors.pop();
            
            setFlashColor(color);

            if (color === lastColor) {
                if (copyColors.length) {
                    setPlay({
                        ...play,
                        userColors: copyColors
                    })    
                } else {
                    await timeout(1000);
                    setPlay({
                        ...play,
                        isDisplay: true,
                        userPlay: false,
                        score: play.colors.length,
                        userColors: []
                    })
                }
                
            } else {
                await timeout(1000);
                setPlay({
                    ...initPlay,
                    score: play.colors.length
                })
            }
            await timeout(1000);
            setFlashColor("");
        }
    }

    const closeHandle = () => {
        setIsOn(false);
    }


    return (
        <div className="App">
            <header className="App-header">
                <div className='cardWrapper'>
                    {
                        colorList.map((color, index) => (
                            <ColorCard onclick={() => { cardClickHandle(color) }} flash={flashColor === color} color={color} key={index}></ColorCard>
                        ))
                    }
                </div>
                {
                    isOn && !play.isDisplay && !play.userPlay && play.score && (
                        <div className='lost'>
                            <div>Final Score: {play.score}</div>
                            <button onClick={closeHandle}>Close</button>
                        </div>
                    )
                }
                {!isOn && !play.score && (
                    <button onClick={ startHandle} className='startButton'>Press</button>
                )}
                {isOn && (play.isDisplay|| play.userPlay) && (
                    <button className='startButton'>{play.score}</button>
                )}
            </header>
        </div>
    );
}

export default App;
