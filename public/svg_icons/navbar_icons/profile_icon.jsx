export default function ProfileIcon({ color = "black", width="50px", height="50px" }) {
    
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg">
            <title>Profile icon</title>

            <path id="Ellipse" fill="none" stroke={color} strokeWidth="60" d="M 957 1018.671875 C 957 766.277771 752.394104 561.671875 500 561.671875 C 247.605865 561.671875 43 766.277771 43 1018.671875 C 43 1271.06604 247.605865 1475.671875 500 1475.671875 C 752.394104 1475.671875 957 1271.06604 957 1018.671875 Z"/>
            <path id="Ellipse-copy" fill="none" stroke={color} strokeWidth="60" d="M 735.671875 306.335938 C 735.671875 175.811218 629.860657 70 499.335938 70 C 368.811218 70 263 175.811218 263 306.335938 C 263 436.860657 368.811218 542.671875 499.335938 542.671875 C 629.860657 542.671875 735.671875 436.860657 735.671875 306.335938 Z"/>
        </svg>
    )
}