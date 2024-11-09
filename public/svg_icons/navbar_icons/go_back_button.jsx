export default function GoBackButton({ color = "black", width="50px", height="50px" }) {
    
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg">
            <title>Go back</title>
            
            <path id="Line-copy" fill="none"
            stroke={color}
            strokeWidth="75" strokeLinecap="round" strokeLinejoin="round" d="M 80.997604 500.00415 L 822.998413 927.003418"
            />
            <path id="Line-copy-2" fill="none"
            stroke={color}
            strokeWidth="75" strokeLinecap="round" strokeLinejoin="round" d="M 80.997604 500.00415 L 823.005371 73.003113"
            />

        
        </svg>
    )
}