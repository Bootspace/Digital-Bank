import otpWay from 'otp-generator';

export const generateOTP = () => {
  const OTP = otpWay.generate(6, {
    digits: true,
    alphabets: true,
    upperCase: false,
    specialChars: false
  });
  return OTP;
}

export default generateOTP;