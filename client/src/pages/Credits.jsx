import React, { useEffect, useState } from 'react';
import Loading from './Loading.jsx';
import {useAppContext} from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Credits = () => {

const[plans, setPlans] = useState([]);
const[loading, setLoading] = useState(true);

const {token, axios} = useAppContext();

const fetchPlans = async()=>{
  try {
    const {data} = await axios.get('/api/credit/plan', {headers: {Authorization : token}});
  if(data.success){
    setPlans(data.plans)
  } else {
    toast.error(data.message || 'Failed to catch plans!');
  }
}
  catch (error) {
    toast.error(error.message);
  }
  setLoading(false);
}

const purchasePlan = async(planId) =>{
  try {
    const {data} = await axios.post('/api/credit/purchase', {planId}, {headers : {Authorization : token}})
    if(data.success) {
      window.location.href = data.url;
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
}

useEffect(()=>{
  fetchPlans();
},[])

if(loading){
  return <Loading />;
}

  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12 '>
      <h2 className=' text-xl sm:text-3xl font-semibold text-center  my-10 xl:mt-30 text-gray-800 dark:text-white'>Credit Plans</h2>

      <div className='flex flex-wrap justify-center gap-8'>
        {plans.map((plan)=>(
          <div key={plan._id} className={`border border-gray-200 dark:border-[#065F46] rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-[280px] flex flex-col ${plan._id === 'pro' ? "bg-[#D1FAE5]/50 dark:bg-[#065F46]/50" : "bg-white dark:bg-transparent"}`}>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>{plan.name}</h3>
              <p className='text-2xl font-bold text-[#34D399] dark:text-[#065F46]  mb-4'>${plan.price}
                <span className='text-base font-normal text-gray-600 dark:text-gray-500'>{' '}/ {plan.credits} credits</span>
              </p>
              <ul className='list-disc list-inside text-sm text-gray-700 dark:text-white space-y-1'>
                {plan.features.map((feature, index)=>(
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button onClick={()=> toast.promise(purchasePlan(plan._id), {loading : 'Processing...'})} className='mt-6 bg-gradient-to-r from-[#34D399] to-[#10B981]  hover:from-[#2FBF8E] hover:to-[#0F9F6F]  text-white font-medium py-2 rounded transition-colors cursor-pointer'>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits
