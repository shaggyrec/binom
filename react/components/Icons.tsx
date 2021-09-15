import React from 'react';

interface Icon {
    size?: number;
    fill?: string;
}

function RenderIcon(props) {
    return (
        <svg
            className="icon"
            x="0px"
            y="0px"
            viewBox={props.viewBox}
            style={{
                width: props.size || 30,
                height: props.size || 30
            }}
            fill={props.fill || '#808080'}
        >
            {props.children}
        </svg>
    );
}

export function Add(props: Icon) {
    return (
        <RenderIcon {...props} viewBox={'0 0 512 512'}>
            <g>
                <g>
                    <path d="M492,236H276V20c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v216H20c-11.046,0-20,8.954-20,20s8.954,20,20,20h216v216c0,11.046,8.954,20,20,20s20-8.954,20-20V276h216c11.046,0,20-8.954,20-20C512,244.954,503.046,236,492,236z"/>
                </g>
            </g>
        </RenderIcon>
    );
}

export function Close(props: Icon) {
    return (
        <RenderIcon {...props} viewBox={'0 0 24 24'}>
            <path d="M20.71,4.71,13.41,12l7.3,7.29a1,1,0,0,1,0,1.42,1,1,0,0,1-1.42,0L12,13.41l-7.29,7.3a1,1,0,0,1-1.42,0,1,1,0,0,1,0-1.42L10.59,12,3.29,4.71A1,1,0,0,1,4.71,3.29L12,10.59l7.29-7.3a1,1,0,1,1,1.42,1.42Z"/>
        </RenderIcon>
    );
}

export function Plus(props: Icon) {
    return (
        <RenderIcon {...props} viewBox={'0 0 426.66667 426.66667'}>
            <path d="m410.667969 229.332031h-394.667969c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h394.667969c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/><path d="m213.332031 426.667969c-8.832031 0-16-7.167969-16-16v-394.667969c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v394.667969c0 8.832031-7.167969 16-16 16zm0 0"/>
        </RenderIcon>
    );
}

export function Minus(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 512 512">
            <path d="M492,236H20c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20h472c11.046,0,20-8.954,20-20S503.046,236,492,236z"/>
        </RenderIcon>
    );
}

export function Up(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 492.002 492.002">
            <g>
                <path d="M484.136,328.473L264.988,109.329c-5.064-5.064-11.816-7.844-19.172-7.844c-7.208,0-13.964,2.78-19.02,7.844 L7.852,328.265C2.788,333.333,0,340.089,0,347.297c0,7.208,2.784,13.968,7.852,19.032l16.124,16.124 c5.064,5.064,11.824,7.86,19.032,7.86s13.964-2.796,19.032-7.86l183.852-183.852l184.056,184.064 c5.064,5.06,11.82,7.852,19.032,7.852c7.208,0,13.96-2.792,19.028-7.852l16.128-16.132 C494.624,356.041,494.624,338.965,484.136,328.473z"/>
            </g>
        </RenderIcon>
    );
}

export function Down(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 284.929 284.929">
            <g>
                <path d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441 L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082 c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647 c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"/>
            </g>
        </RenderIcon>
    );
}

export function Blog(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="-30 0 511 511.99975">
            <path d="m90.960938 90h60v30h-60zm0 0"/>
            <path d="m75.960938 210c-8.28125 0-15-6.722656-15-15 0-8.28125 6.71875-15 15-15h239.996093c8.289063 0 15 6.71875 15 15 0 8.277344-6.710937 15-15 15h75v-175c0-19.300781-15.699219-35-35-35h-320.457031c-19.300781 0-35 15.699219-35 35v349.996094c0 19.300781 15.699219 35 35 35h115.460938v-104.996094c0 8.277344-6.710938 15-15 15h-60c-8.28125 0-15-6.722656-15-15 0-8.28125 6.71875-15 15-15h60c8.289062 0 15 6.71875 15 15v-50c0-30.332031 24.667968-55 54.996093-55zm149.996093-150h90c8.289063 0 15 6.71875 15 15s-6.710937 15-15 15h-90c-8.277343 0-15-6.71875-15-15s6.722657-15 15-15zm0 60h90c8.289063 0 15 6.71875 15 15 0 8.277344-6.710937 15-15 15h-90c-8.277343 0-15-6.722656-15-15 0-8.28125 6.722657-15 15-15zm-164.996093-45c0-8.28125 6.71875-15 15-15h89.996093c8.292969 0 15 6.71875 15 15v60c0 8.277344-6.707031 15-15 15h-89.996093c-8.28125 0-15-6.722656-15-15zm75 195h-60c-8.28125 0-15-6.722656-15-15 0-8.28125 6.71875-15 15-15h60c8.289062 0 15 6.71875 15 15 0 8.277344-6.710938 15-15 15zm0 0"/><path d="m425.957031 240h-219.996093c-13.785157 0-25 11.214844-25 25v159.996094c0 13.785156 11.214843 25 25 25h35v47c0 13.726562 16.875 20.125 26.042968 10.152344l52.519532-57.152344h106.433593c13.785157 0 25-11.214844 25-25v-159.996094c0-13.785156-11.214843-25-25-25zm-83 149.996094h-86.996093c-8.285157 0-15-6.714844-15-15 0-8.28125 6.714843-15 15-15h86.996093c8.285157 0 15 6.71875 15 15 0 8.285156-6.714843 15-15 15zm33-59.996094h-119.996093c-8.285157 0-15-6.71875-15-15 0-8.285156 6.714843-15 15-15h119.996093c8.285157 0 15 6.714844 15 15 0 8.28125-6.714843 15-15 15zm0 0"/>
        </RenderIcon>
    );
}

export function Send(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 437.296 437.296">
            <g>
                <path fill={props.fill} d="M432.706,6.798c-4.608-4.608-10.24-5.632-15.36-3.584L72.77,141.454c-5.632,2.048-9.216,8.192-9.216,13.824 s4.608,11.264,10.24,13.312l151.04,46.592l46.592,150.528c1.536,5.632,6.656,9.728,13.312,10.24h0.512 c5.632,0,10.752-3.584,13.312-9.216L436.29,22.158C438.338,17.038,437.314,10.894,432.706,6.798z"/>
            </g>
            <g>
                <rect fill={props.fill} x="35.486" y="332.084" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -218.8917 164.3892)" width="107.007" height="28.672"/>
            </g>
            <g>
                <rect fill={props.fill} x="-5.534" y="250.702" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -173.3598 111.5473)" width="107.007" height="28.672"/>
            </g>
            <g>
                <rect fill={props.fill} x="116.723" y="372.783" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -223.876 233.7532)" width="107.007" height="28.672"/>
            </g>
        </RenderIcon>
    );
}

export function Favorites(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 512.002 512.002">
            <g><path d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157 c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065 c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671 c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638 l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955 C511.56,208.649,513.033,202.688,511.267,197.258z"/></g>
        </RenderIcon>
    );
}

export function Rocket(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 511.945 511.945">
            <g><path d="m346.392 165.542c-7.239-7.24-16.886-11.225-27.164-11.217-20.825.012-38.392 16.708-38.386 38.373.003 10.279 3.99 19.928 11.228 27.164 14.979 14.979 39.325 15 54.274.051 15.003-15.004 15.025-39.394.048-54.371z"/><path d="m511.945.089-15.003.014c-107.34.102-212.507 45.281-288.567 123.971l-149.082 149.081 179.488 179.486 149.073-149.072c37.509-36.152 68.594-80.732 89.903-128.924 40.388-91.346 33.309-165.178 34.188-174.556zm-241.051 240.951c-26.685-26.688-26.678-69.999-.049-96.625 26.694-26.696 70.008-26.764 96.723-.049 26.653 26.652 26.632 70.045-.047 96.725-26.624 26.623-69.97 26.599-96.627-.051z"/><path d="m-4.88 446.723h110.233v29.949h-110.233z" transform="matrix(.707 -.707 .707 .707 -311.748 170.742)"/><path d="m98.599 464.477h39.489v29.948h-39.489z" transform="matrix(.707 -.707 .707 .707 -304.354 224.098)"/><path d="m12.775 378.699h39.252v29.946h-39.252z" transform="matrix(.707 -.707 .707 .707 -268.884 138.222)"/><path d="m389.634 359.466-7.662-7.662-122.016 122.017 38.035 38.036 67.604-67.604z"/><path d="m67.61 146.251-67.61 67.611 38.115 38.118 122.019-122.02-7.662-7.662z"/><path d="m34.858 334.036 143.038 143.039 29.315-13.65-158.704-158.701z"/></g>
        </RenderIcon>
    );
}

export function Clock(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 515.556 515.556">
            <path d="m257.778 0c-142.137 0-257.778 115.641-257.778 257.778s115.641 257.778 257.778 257.778 257.778-115.641 257.778-257.778-115.642-257.778-257.778-257.778zm57.773 361.115-89.996-89.996v-142.231h64.445v115.547l71.115 71.115c.001 0-45.564 45.565-45.564 45.565z"/>
        </RenderIcon>
    );
}

export function Cancel(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 -192 469.33333 469">
            <path d="m437.332031.167969h-405.332031c-17.664062 0-32 14.335937-32 32v21.332031c0 17.664062 14.335938 32 32 32h405.332031c17.664063 0 32-14.335938 32-32v-21.332031c0-17.664063-14.335937-32-32-32zm0 0"/>
        </RenderIcon>
    );
}

export function Stop(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 512 512">
            <g><path d="m498.704 206.14-78.172-135.374c-17.726-30.756-50.815-49.862-86.355-49.862h-156.354c-35.54 0-68.63 19.106-86.349 49.851l-78.183 135.395c-17.722 30.749-17.722 68.951.006 99.71l78.171 135.374c17.726 30.756 50.815 49.862 86.355 49.862h156.354c35.54 0 68.629-19.106 86.349-49.851l78.183-135.395c17.722-30.749 17.722-68.951-.005-99.71zm-387.305 113.06h-16.066c-8.284 0-15-6.716-15-15s6.716-15 15-15h16.066c5.019 0 9.101-4.083 9.101-9.1s-4.082-9.1-9.101-9.1c-21.56 0-39.1-17.54-39.1-39.1s17.54-39.1 39.1-39.1h16.067c8.284 0 15 6.716 15 15s-6.716 15-15 15h-16.067c-5.018 0-9.1 4.083-9.1 9.1s4.082 9.1 9.1 9.1c21.561 0 39.101 17.54 39.101 39.1s-17.54 39.1-39.101 39.1zm112.467-96.4h-9.1v81.4c0 8.284-6.716 15-15 15s-15-6.716-15-15v-81.4h-9.1c-8.284 0-15-6.716-15-15s6.716-15 15-15h48.199c8.284 0 15 6.716 15 15s-6.715 15-14.999 15zm111.401 53.283c0 23.774-19.342 43.117-43.116 43.117s-43.117-19.342-43.117-43.117v-40.167c0-23.774 19.343-43.117 43.117-43.117s43.116 19.342 43.116 43.117zm57.299 10.984h-9.1v17.133c0 8.284-6.716 15-15 15s-15-6.716-15-15v-96.4c0-8.284 6.716-15 15-15h24.1c25.989 0 47.134 21.144 47.134 47.133 0 25.99-21.144 47.134-47.134 47.134z"/><path d="m292.15 222.8c-7.232 0-13.117 5.884-13.117 13.117v40.167c0 7.232 5.885 13.117 13.117 13.117s13.116-5.884 13.116-13.117v-40.167c.001-7.233-5.883-13.117-13.116-13.117z"/><path d="m392.566 222.8h-9.1v34.267h9.1c9.447 0 17.134-7.686 17.134-17.134 0-9.447-7.686-17.133-17.134-17.133z"/></g>
        </RenderIcon>
    );
}

export function Complete(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 45.701 45.7">
            <g><path d="M20.687,38.332c-2.072,2.072-5.434,2.072-7.505,0L1.554,26.704c-2.072-2.071-2.072-5.433,0-7.504 c2.071-2.072,5.433-2.072,7.505,0l6.928,6.927c0.523,0.522,1.372,0.522,1.896,0L36.642,7.368c2.071-2.072,5.433-2.072,7.505,0 c0.995,0.995,1.554,2.345,1.554,3.752c0,1.407-0.559,2.757-1.554,3.752L20.687,38.332z"/></g>
        </RenderIcon>
    );
}

export function Comments(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 511.096 511.096">
            <g><path d="m74.414 480.548h-36.214l25.607-25.607c13.807-13.807 22.429-31.765 24.747-51.246-59.127-38.802-88.554-95.014-88.554-153.944 0-108.719 99.923-219.203 256.414-219.203 165.785 0 254.682 101.666 254.682 209.678 0 108.724-89.836 210.322-254.682 210.322-28.877 0-59.01-3.855-85.913-10.928-25.467 26.121-59.973 40.928-96.087 40.928z"/></g>
        </RenderIcon>
    );
}

export function Bin(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 512 512">
            <g><path d="m428.332 135.275-11.167-33.466c-2.248-6.736-8.552-11.278-15.653-11.278h-291.024c-7.101 0-13.405 4.543-15.653 11.278l-11.167 33.466c-2.53 7.582 3.113 15.414 11.106 15.414h322.451c7.994 0 13.637-7.832 11.107-15.414z"/><path id="XMLID_835_" d="m135.615 491.767c1.28 11.519 11.016 20.233 22.606 20.233h193.718c11.59 0 21.326-8.715 22.606-20.233l34.565-311.077h-308.06z"/><path id="XMLID_831_" d="m225.89 42.998c0-7.167 5.831-12.998 12.998-12.998h44.189c7.167 0 12.998 5.831 12.998 12.998v17.533h30v-17.533c0-23.709-19.289-42.998-42.998-42.998h-44.189c-23.709 0-42.998 19.289-42.998 42.998v17.533h30z"/></g>
        </RenderIcon>
    );
}

export function Profile(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="-42 0 512 512.002">
            <path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"/><path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/>
        </RenderIcon>
    );
}

export function PrivateIcon(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 477.859 477.859">
            <g><g><path d="M474.603,228.903c-28.995-38.012-63.834-71.186-103.219-98.287l-61.338,61.338 c26.009,39.211,15.306,92.083-23.906,118.091c-28.545,18.934-65.653,18.931-94.195-0.007l-55.108,55.177 c31.32,17.228,66.354,26.598,102.093,27.307c129.707,0,231.407-137.694,235.674-143.565 C478.944,242.977,478.944,234.882,474.603,228.903z"/></g></g><g><g><path d="M238.93,85.321c-129.707,0-231.407,137.711-235.674,143.582c-4.341,5.98-4.341,14.074,0,20.053 c28.995,38.012,63.834,71.186,103.219,98.287l61.338-61.338c-9.272-13.915-14.218-30.263-14.217-46.985 c-0.076-47.053,38.007-85.258,85.059-85.334c16.81-0.027,33.253,4.92,47.258,14.217l55.108-55.177 C309.702,95.4,274.669,86.029,238.93,85.321z"/></g></g><g><g><path d="M106.475,347.294L39.13,414.588c-6.669,6.664-6.672,17.472-0.009,24.141c6.664,6.669,17.472,6.672,24.141,0.009 l73.574-73.523C126.398,359.797,116.262,353.815,106.475,347.294z"/></g></g><g><g><path d="M438.738,39.13c-6.664-6.669-17.472-6.672-24.141-0.009l-73.574,73.506c10.439,5.417,20.574,11.399,30.362,17.92 l67.345-67.277C445.398,56.607,445.401,45.799,438.738,39.13z"/></g></g><g><g><path d="M285.914,167.804L167.813,285.906c6.346,9.58,14.552,17.786,24.132,24.132l118.101-118.084 C303.696,182.373,295.491,174.161,285.914,167.804z"/></g></g>
        </RenderIcon>
    );
}

export function Visibility(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 512.008 512.008">
            <g><path d="M510.112,249.924c-4.032-5.845-100.928-143.253-254.101-143.253c-131.435,0-248.555,136.619-253.483,142.443 c-3.371,3.968-3.371,9.792,0,13.781c4.928,5.824,122.048,142.443,253.483,142.443s248.555-136.619,253.483-142.443 C512.587,259.204,512.864,253.892,510.112,249.924z M256.011,341.337c-47.061,0-85.333-38.272-85.333-85.333 s38.272-85.333,85.333-85.333s85.333,38.272,85.333,85.333S303.072,341.337,256.011,341.337z"/></g>
        </RenderIcon>
    );
}

export function Learning(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 512.001 512.001">
            <g><path d="m241.969 379.815c-8.178 0-16.205-2.23-23.21-6.448l-122.338-73.642v45.325c0 29.849 15.813 57.563 44.527 78.04 27.178 19.38 63.054 30.053 101.021 30.053 37.966 0 73.842-10.673 101.02-30.053 28.714-20.476 44.527-48.191 44.527-78.04v-45.325l-122.34 73.644c-7.003 4.216-15.029 6.446-23.207 6.446z"/><path d="m501.192 422.355c5.781-1.684 10.215-6.778 10.755-13.137.701-8.254-5.422-15.514-13.677-16.215l-14.331-1.217v-193.598c.028-5.177-2.817-10.204-7.264-12.851l-226.97-136.627c-4.759-2.865-10.713-2.865-15.472 0l-226.969 136.627c-4.508 2.714-7.264 7.59-7.264 12.851s2.756 10.138 7.264 12.851l226.969 136.627c2.379 1.433 5.058 2.149 7.736 2.149s5.356-.716 7.736-2.149l204.233-122.941v225.714c0 8.284 6.716 15 15 15s15-6.716 15-15v-1.48c5.002 7.675 15.042 9.822 22.325 4.145 6.516-5.116 7.651-14.545 2.535-21.061z"/></g>
        </RenderIcon>
    );
}

export function Gear(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 512 512">
            <g><path d="M500.6,212.6l-59.9-14.7c-3.3-10.5-7.5-20.7-12.6-30.6l30.6-51c3.6-6,2.7-13.5-2.1-18.3L414,55.4 c-4.8-4.8-12.3-5.7-18.3-2.1l-51,30.6c-9.9-5.1-20.1-9.3-30.6-12.6l-14.4-59.9C297.9,4.8,291.9,0,285,0h-60 c-6.9,0-12.9,4.8-14.7,11.4l-14.4,59.9c-10.5,3.3-20.7,7.5-30.6,12.6l-51-30.6c-6-3.6-13.5-2.7-18.3,2.1L53.4,98 c-4.8,4.8-5.7,12.3-2.1,18.3l30.6,51c-5.1,9.9-9.3,20.1-12.6,30.6l-57.9,14.7C4.8,214.1,0,220.1,0,227v60 c0,6.9,4.8,12.9,11.4,14.4l57.9,14.7c3.3,10.5,7.5,20.7,12.6,30.6l-30.6,51c-3.6,6-2.7,13.5,2.1,18.3L96,458.6 c4.8,4.8,12.3,5.7,18.3,2.1l51-30.6c9.9,5.1,20.1,9.3,30.6,12.6l14.4,57.9c1.8,6.6,7.8,11.4,14.7,11.4h60 c6.9,0,12.9-4.8,14.7-11.4l14.4-57.9c10.5-3.3,20.7-7.5,30.6-12.6l51,30.6c6,3.6,13.5,2.7,18.3-2.1l42.6-42.6 c4.8-4.8,5.7-12.3,2.1-18.3l-30.6-51c5.1-9.9,9.3-20.1,12.6-30.6l59.9-14.7c6.6-1.5,11.4-7.5,11.4-14.4v-60 C512,220.1,507.2,214.1,500.6,212.6z M255,332c-41.4,0-75-33.6-75-75c0-41.4,33.6-75,75-75c41.4,0,75,33.6,75,75 C330,298.4,296.4,332,255,332z"/></g>
        </RenderIcon>
    );
}

export function Warning(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 512 512">
            <g><path d="M501.362,383.95L320.497,51.474c-29.059-48.921-99.896-48.986-128.994,0L10.647,383.95 c-29.706,49.989,6.259,113.291,64.482,113.291h361.736C495.039,497.241,531.068,433.99,501.362,383.95z M256,437.241 c-16.538,0-30-13.462-30-30c0-16.538,13.462-30,30-30c16.538,0,30,13.462,30,30C286,423.779,272.538,437.241,256,437.241z M286,317.241c0,16.538-13.462,30-30,30c-16.538,0-30-13.462-30-30v-150c0-16.538,13.462-30,30-30c16.538,0,30,13.462,30,30 V317.241z"/></g>
        </RenderIcon>
    );
}

export function Checked(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 -21 512.00533 512">
            <path d="m306.582031 317.25c-12.074219 12.097656-28.160156 18.753906-45.25 18.753906-17.085937 0-33.171875-6.65625-45.246093-18.753906l-90.667969-90.664062c-12.09375-12.078126-18.75-28.160157-18.75-45.25 0-17.089844 6.65625-33.171876 18.75-45.246094 12.074219-12.097656 28.160156-18.753906 45.25-18.753906 17.085937 0 33.171875 6.65625 45.246093 18.753906l45.417969 45.394531 125.378907-125.375c-40.960938-34.921875-93.996094-56.10546875-152.042969-56.10546875-129.601563 0-234.667969 105.06640575-234.667969 234.66406275 0 129.601562 105.066406 234.667969 234.667969 234.667969 129.597656 0 234.664062-105.066407 234.664062-234.667969 0-24.253907-3.6875-47.636719-10.515625-69.652344zm0 0"/><path d="m261.332031 293.335938c-5.460937 0-10.921875-2.089844-15.082031-6.25l-90.664062-90.667969c-8.34375-8.339844-8.34375-21.824219 0-30.164063 8.339843-8.34375 21.820312-8.34375 30.164062 0l75.582031 75.582032 214.253907-214.25c8.339843-8.339844 21.820312-8.339844 30.164062 0 8.339844 8.34375 8.339844 21.824218 0 30.167968l-229.335938 229.332032c-4.15625 4.160156-9.621093 6.25-15.082031 6.25zm0 0"/>
        </RenderIcon>
    );
}

export function Edit(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 512.001 512.001">
            <g><g><path d="M496.063,62.299l-46.396-46.4c-21.2-21.199-55.69-21.198-76.888,0l-18.16,18.161l123.284,123.294l18.16-18.161 C517.311,117.944,517.314,83.55,496.063,62.299z"/></g></g><g><g><path d="M22.012,376.747L0.251,494.268c-0.899,4.857,0.649,9.846,4.142,13.339c3.497,3.497,8.487,5.042,13.338,4.143 l117.512-21.763L22.012,376.747z"/></g></g><g><g><polygon points="333.407,55.274 38.198,350.506 161.482,473.799 456.691,178.568 		"/></g></g>
        </RenderIcon>
    );
}

export function Save(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 512 512">
            <g><path d="M493.254,77.255l-58.508-58.51C422.742,6.742,406.465,0,389.49,0H352v112c0,8.836-7.164,16-16,16H80 c-8.836,0-16-7.164-16-16V0H32C14.328,0,0,14.326,0,32v448c0,17.673,14.328,32,32,32h448c17.672,0,32-14.327,32-32V122.51 C512,105.535,505.258,89.257,493.254,77.255z M448,448H64V256h384V448z"/><rect x="224" width="64" height="96"/></g>
        </RenderIcon>
    );
}

export function Back(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 492 492">
            <path d="M464.344,207.418l0.768,0.168H135.888l103.496-103.724c5.068-5.064,7.848-11.924,7.848-19.124 c0-7.2-2.78-14.012-7.848-19.088L223.28,49.538c-5.064-5.064-11.812-7.864-19.008-7.864c-7.2,0-13.952,2.78-19.016,7.844 L7.844,226.914C2.76,231.998-0.02,238.77,0,245.974c-0.02,7.244,2.76,14.02,7.844,19.096l177.412,177.412 c5.064,5.06,11.812,7.844,19.016,7.844c7.196,0,13.944-2.788,19.008-7.844l16.104-16.112c5.068-5.056,7.848-11.808,7.848-19.008 c0-7.196-2.78-13.592-7.848-18.652L134.72,284.406h329.992c14.828,0,27.288-12.78,27.288-27.6v-22.788 C492,219.198,479.172,207.418,464.344,207.418z"/>
        </RenderIcon>
    );
}

export function Attach(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 511.988 511.988">
	        <g><path d="M489.305,185.463c-8.354-8.309-21.861-8.272-30.17,0.081L202.687,443.379c-33.271,33.271-87.308,33.271-120.641-0.045 c-33.308-33.325-33.308-87.362,0.004-120.674L346.089,57.234c20.772-20.771,54.543-20.771,75.375,0.045 c20.826,20.826,20.826,54.593-0.005,75.425L202.727,351.434c-0.014,0.014-0.026,0.03-0.04,0.044 c-8.333,8.287-21.8,8.276-30.116-0.04c-8.33-8.33-8.33-21.831,0-30.161l105.58-105.602c8.33-8.332,8.329-21.84-0.003-30.17 c-8.332-8.33-21.84-8.329-30.17,0.003l-105.579,105.6c-24.991,24.991-24.991,65.507,0.002,90.499 c24.992,24.992,65.508,24.992,90.501,0c0.029-0.029,0.052-0.06,0.08-0.089l218.646-218.646c37.494-37.494,37.494-98.276,0-135.77 c-37.499-37.472-98.277-37.472-135.749,0L51.84,292.53C1.906,342.464,1.906,423.509,51.876,473.504 c50.003,49.977,131.049,49.977,181.022,0.004l256.489-257.875C497.695,207.279,497.658,193.772,489.305,185.463z"/></g>
        </RenderIcon>
    );
}

export function Notification(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 24 24">
            <g><path d="m21.379 16.913c-1.512-1.278-2.379-3.146-2.379-5.125v-2.788c0-3.519-2.614-6.432-6-6.92v-1.08c0-.553-.448-1-1-1s-1 .447-1 1v1.08c-3.387.488-6 3.401-6 6.92v2.788c0 1.979-.867 3.847-2.388 5.133-.389.333-.612.817-.612 1.329 0 .965.785 1.75 1.75 1.75h16.5c.965 0 1.75-.785 1.75-1.75 0-.512-.223-.996-.621-1.337z"/><path d="m12 24c1.811 0 3.326-1.291 3.674-3h-7.348c.348 1.709 1.863 3 3.674 3z"/></g>
        </RenderIcon>
    );
}

export function Processing(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="-15 0 494 494.944">
            <path d="m400.472656 254.945312v8c0 92.628907-75.367187 168-168 168-92.632812 0-168-75.371093-168-168 0-89.953124 71.0625-163.625 160-167.816406v30.757813l94.421875-62.941407-94.421875-62.945312v31.078125c-124.234375 4.234375-224 106.617187-224 231.867187 0 127.917969 104.078125 232 232 232 127.917969 0 232-104.082031 232-232v-8zm0 0"/><path d="m211.984375 291.550781c-16.703125 7.898438-27.511719 24.929688-27.511719 43.394531v16h96v-16c0-18.464843-10.808594-35.496093-27.511718-43.394531-7.59375-3.574219-12.488282-11.207031-12.488282-19.4375 0-8.234375 4.894532-15.847656 12.488282-19.433593 16.703124-7.902344 27.511718-24.925782 27.511718-43.382813v-18.351563h-96v18.351563c0 18.457031 10.808594 35.488281 27.519532 43.390625 7.574218 3.578125 12.480468 11.199219 12.480468 19.433594 0 8.230468-4.898437 15.855468-12.488281 19.429687zm0 0"/><path d="m168.472656 366.945312h128.007813v16h-128.007813zm0 0"/><path d="m168.472656 158.945312h128.007813v16h-128.007813zm0 0"/><path d="m392.660156 211.738281 15.453125-4.140625 4.140625 15.453125-15.453125 4.140625zm0 0"/><path d="m373.976562 172.027344 13.855469-8 8 13.859375-13.859375 7.996093zm0 0"/><path d="m345.609375 138.488281 11.3125-11.3125 11.3125 11.3125-11.3125 11.3125zm0 0"/><path d="m309.539062 113.4375 7.996094-13.855469 13.859375 7.996094-8 13.859375zm0 0"/><path d="m442.753906 212.953125 15.683594-3.117187 3.117188 15.683593-15.683594 3.117188zm0 0"/><path d="m428.957031 172.914062 14.789063-6.125 6.121094 14.78125-14.789063 6.125zm0 0"/><path d="m407.621094 136.308594 13.300781-8.890625 8.890625 13.292969-13.300781 8.894531zm0 0"/><path d="m379.546875 104.554688 11.3125-11.316407 11.3125 11.316407-11.3125 11.3125zm0 0"/><path d="m345.816406 78.898438 8.894532-13.300782 13.292968 8.890625-8.890625 13.300781zm0 0"/>
        </RenderIcon>
    );
}

export function Locked(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 24 24">
            <path d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z"/>
        </RenderIcon>
    );
}

export function ArrowRight(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="0 0 123.964 123.964">
	        <path d="M121.7,57.681L83,26.881c-4-3.1-10-0.3-10,4.8v10.3c0,3.3-2.2,6.2-5.5,6.2H6c-3.3,0-6,2.4-6,5.8v16.2c0,3.2,2.7,6,6,6h61.5 c3.3,0,5.5,2.601,5.5,5.9v10.3c0,5,6,7.8,9.9,4.7l38.6-30C124.7,64.781,124.8,60.081,121.7,57.681z"/>
        </RenderIcon>
    );
}

export function FileIcon(props: Icon) {
    return (
        <RenderIcon {...props} viewBox="-58 1 511 511.99995">
            <path d="M 314.609375 123.257812 L 381.113281 123.257812 L 279.527344 16.660156 L 279.527344 88.3125 C 279.527344 107.683594 295.101562 123.257812 314.609375 123.257812 Z M 314.609375 123.257812" />
            <path d="M 257.855469 88.3125 L 257.855469 0 L 49.804688 0 C 22.847656 0 0.5 22.214844 0.5 49.167969 L 0.5 462.832031 C 0.5 489.789062 22.847656 512 49.804688 512 L 346.710938 512 C 373.664062 512 396.011719 489.785156 396.011719 462.832031 L 396.011719 144.929688 L 314.605469 144.929688 C 283.183594 144.929688 257.855469 119.601562 257.855469 88.3125 Z M 111.570312 264.804688 C 115.902344 260.742188 122.8125 261.011719 126.875 265.347656 L 187.421875 330.363281 L 187.421875 175.679688 C 187.421875 169.71875 192.296875 164.84375 198.257812 164.84375 C 204.21875 164.84375 209.09375 169.71875 209.09375 175.679688 L 209.09375 330.496094 L 269.640625 265.480469 C 273.703125 261.148438 280.613281 260.875 284.945312 264.9375 C 289.28125 269.003906 289.550781 275.910156 285.488281 280.246094 L 206.113281 365.445312 C 204.082031 367.609375 201.238281 368.828125 198.121094 368.828125 C 195.007812 368.828125 192.296875 367.609375 190.132812 365.445312 L 110.757812 280.246094 C 106.964844 275.773438 107.234375 269.003906 111.570312 264.804688 Z M 320.566406 429.375 C 320.566406 435.335938 315.691406 440.210938 309.730469 440.210938 L 86.78125 440.210938 C 80.820312 440.210938 75.945312 435.335938 75.945312 429.375 C 75.945312 423.414062 80.820312 418.539062 86.78125 418.539062 L 309.867188 418.539062 C 315.828125 418.539062 320.566406 423.417969 320.566406 429.375 Z M 320.566406 429.375 " />
        </RenderIcon>
    );
}