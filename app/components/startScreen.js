import { useState, useEffect, useContext } from 'react';
import { PageLoadContext } from '../../contexts/PageLoadContext';

const StartScreen = ({ activePage, activeInsidePage, theme, language, themeColor }) => {
    // const [showRedScreen, setShowRedScreen] = useState(false);

    // useEffect(() => {
    //     if (activePage === '') {
    //         setShowRedScreen(true);
    //     } else {
    //         const timer = setTimeout(() => {
    //             setShowRedScreen(false);
    //         }, 1000); // Simulerar att sidan laddas klart efter 1 sekund

    //         return () => clearTimeout(timer);
    //     }
    // }, [activePage]);


    const [showRedScreen, setShowRedScreen] = useState(false);
    const { setIsPageLoaded, isPageLoaded } = useContext(PageLoadContext);

    // useEffect(() => {
    //     if (activePage === '') {
    //         setShowRedScreen(true);
    //         setIsPageLoaded(false);
    //     } else {
    //         const timer = setTimeout(() => {
    //             setShowRedScreen(false);
    //             setIsPageLoaded(true);
    //         }, 1000); // Simulerar att sidan laddas klart efter 1 sekund

    //         return () => clearTimeout(timer);
    //     }
    // }, [activePage, setIsPageLoaded]);

    useEffect(() => {
        if (activePage === '') {
            setShowRedScreen(true);
            setIsPageLoaded(false);
        } else {
            // setIsPageLoaded(true);
        }
    }, [activePage, setIsPageLoaded]);
    
    useEffect(() => {
        if (isPageLoaded) {
            setShowRedScreen(false);
        }
    }, [isPageLoaded]);

    return (
        <div>
            {showRedScreen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    // backgroundColor: 'red',
                    backgroundColor: theme === 'light' ? 'white' : 'black',
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div className="loop-logo-big" style={{'--themeColor': themeColor }}> </div>
                </div>
            )}
            {/* Din övriga komponentkod här */}
            <div>
                {/* <p>activePage: {activePage}</p> */}
                {/* Lägg till mer innehåll här */}
            </div>
        </div>
    );
}

export default StartScreen;