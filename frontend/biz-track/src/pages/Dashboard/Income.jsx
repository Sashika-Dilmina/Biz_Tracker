import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview'
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useEffect } from 'react';
import { IoMdDoneAll } from 'react-icons/io';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';


const Income = () => {

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data:null,

  });
  const [OpenAddIncomeModal,setOpenAddIncomeModal] = useState(false)

  // Get All Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return ;

    setLoading(true);

    try{
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something Went Wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Income
  const handleAddIncome = async (income) => {
    const {source, amount, date, icon } = income;

    // Validation Check
    if(!source.trim()) {
      toast.error("Source is required.");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Amount should be a valid number greater than 0.")
      return;
    }

    if (!date){
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      }); 

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();

    } catch (error){
      console.error(
        "Error adding income:",
        error.response?.date?.message || error.message
      );
    }
  } ;

  // Delete Income
  const deleteIncome = async (id) => {};

  // handle download income details
  const handleDownloadIncomeDetails = async () => {};


  useEffect(() => {
    fetchIncomeDetails()
  
    return () => {
      
    }
  }, [])
  
  

  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
              />
          </div>
        </div>

        <Modal 
          isOpen = {OpenAddIncomeModal}
          onClose = {() => setOpenAddIncomeModal(false)}
          title = "Add Income"
          >
            <AddIncomeForm onAddIncome = {handleAddIncome} />
          </Modal>
        </div>
        </DashboardLayout>
  )
}

export default Income