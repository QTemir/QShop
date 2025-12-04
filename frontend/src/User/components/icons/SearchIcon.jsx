import React from "react";

const SearchIcon = (props) => (
    <svg
        width={props.size || 20}
        height={props.size || 20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <mask
            id="mask0_287_1004"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="1"
            y="1"
            width="17"
            height="17"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.6665 1.66663H17.8972V17.8975H1.6665V1.66663Z"
                fill="white"
            />
        </mask>
        <g mask="url(#mask0_287_1004)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.78209 2.91663C5.99626 2.91663 2.91626 5.99579 2.91626 9.78163C2.91626 13.5675 5.99626 16.6475 9.78209 16.6475C13.5671 16.6475 16.6471 13.5675 16.6471 9.78163C16.6471 5.99579 13.5671 2.91663 9.78209 2.91663ZM9.78209 17.8975C5.30709 17.8975 1.66626 14.2566 1.66626 9.78163C1.66626 5.30663 5.30709 1.66663 9.78209 1.66663C14.2571 1.66663 17.8971 5.30663 17.8971 9.78163C17.8971 14.2566 14.2571 17.8975 9.78209 17.8975Z"
                fill="url(#paint0_linear_287_1004)"
            />
        </g>
        <mask
            id="mask1_287_1004"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="14"
            y="14"
            width="5"
            height="5"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3665 14.7557H18.5532V18.9347H14.3665V14.7557Z"
                fill="white"
            />
        </mask>
        <g mask="url(#mask1_287_1004)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.9283 18.9347C17.7692 18.9347 17.6092 18.8739 17.4867 18.7522L14.55 15.8239C14.3058 15.5797 14.305 15.1839 14.5492 14.9397C14.7925 14.6939 15.1883 14.6955 15.4333 14.938L18.37 17.8672C18.6142 18.1114 18.615 18.5064 18.3708 18.7505C18.2492 18.8739 18.0883 18.9347 17.9283 18.9347Z"
                fill="url(#paint1_linear_287_1004)"
            />
        </g>
        <defs>
            <linearGradient
                id="paint0_linear_287_1004"
                x1="1.66626"
                y1="9.78204"
                x2="17.8971"
                y2="9.78204"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#0C1CFF" />
                <stop offset="1" stopColor="#3EFFD8" />
            </linearGradient>
            <linearGradient
                id="paint1_linear_287_1004"
                x1="14.3665"
                y1="16.8452"
                x2="18.5535"
                y2="16.8452"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#0C1CFF" />
                <stop offset="1" stopColor="#3EFFD8" />
            </linearGradient>
        </defs>
    </svg>
);

export default SearchIcon;
