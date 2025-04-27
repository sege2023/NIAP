export const paystackResponse = async (email:string, amount:number) => {
   const res =  await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers:{
            authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            email:email,
            amount:amount * 100,
        })
})
const data = await res.json();
return data;
}


     