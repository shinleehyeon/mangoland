import React from 'react';
import Svg, { Path } from 'react-native-svg';

const TreeIcon = ({ color = "#999999" }) => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M9.40179 0.230469L2.76786 6.61719C2.59375 6.78125 2.5 7 2.5 7.22266C2.5 7.72266 2.95982 8.125 3.53125 8.125H4.64286L1.36607 10.9922C1.17857 11.1562 1.07143 11.3828 1.07143 11.6172C1.07143 12.1055 1.52232 12.5 2.08036 12.5H3.57143L0.241071 15.9961C0.0848214 16.1602 0 16.3672 0 16.582C0 17.0898 0.46875 17.5 1.04911 17.5H8.57143V18.75C8.57143 19.4414 9.20982 20 10 20C10.7902 20 11.4286 19.4414 11.4286 18.75V17.5H18.9509C19.5312 17.5 20 17.0898 20 16.582C20 16.3672 19.9152 16.1602 19.7589 15.9961L16.4286 12.5H17.9196C18.4777 12.5 18.9286 12.1055 18.9286 11.6172C18.9286 11.3828 18.8214 11.1562 18.6339 10.9922L15.3571 8.125H16.4688C17.0357 8.125 17.5 7.72266 17.5 7.22266C17.5 7 17.4062 6.78125 17.2321 6.61719L10.5982 0.230469C10.4464 0.0820312 10.2277 0 10 0C9.77232 0 9.55357 0.0820312 9.40179 0.230469Z"
      fill={color}
    />
  </Svg>
);

export default TreeIcon;