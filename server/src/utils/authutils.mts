export const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  };
  
export const sendVerificationEmail = async (email: string, code: string) => {
    console.log(`Send email to ${email} with code ${code}`);
    
  };
  