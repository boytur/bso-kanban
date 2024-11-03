'use client'

import { SetStateAction, useState } from 'react';

export default function Page() {
    // const router = useRouter()
    const [selectedCard, setSelectedCard] = useState('');
    const [formData, setFormData] = useState({
        price: 'xxxx.xx',
        paymentType: 'PayPal/Checks/Cash',
        prefix: '',
        name: '',
        phone: '',
        address: ''
    });

    const handlePackage = (card: SetStateAction<string>) => {
        setSelectedCard(card);
        setFormData((prevData) => ({
            ...prevData,
            price: card === 'card1' ? '1999' : card === 'card2' ? '799' : '349',
        }));
    };

    const handlePayment = (card: SetStateAction<string>) => {
        setSelectedCard(card);
        setFormData((prevData) => ({
            ...prevData,
            paymentType: card === 'card4' ? 'PayPal' : card === 'card5' ? 'Checks' : 'Cash',
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    return (
        <div className='flex gap-2'>
            <div className="grid grid-cols-3 gap-4 bg-white p-4">
                <div className="card bg-white hover:bg-blue-300 hover:scale-105 transition-all duration-200" onClick={() => handlePackage('card1')}>card1</div>
                <div className="card bg-white hover:bg-blue-300 hover:scale-105 transition-all duration-200" onClick={() => handlePackage('card2')}>card2</div>
                <div className="card bg-white hover:bg-blue-300 hover:scale-105 transition-all duration-200" onClick={() => handlePackage('card3')}>card3</div>
                <div className="card bg-white hover:bg-blue-300 hover:scale-105 transition-all duration-200" onClick={() => handlePayment('card4')}>card4</div>
                <div className="card bg-white hover:bg-blue-300 hover:scale-105 transition-all duration-200" onClick={() => handlePayment('card5')}>card5</div>
                <div className="card bg-white hover:bg-blue-300 hover:scale-105 transition-all duration-200" onClick={() => handlePayment('card6')}>card6</div>
            </div>

            <div className='bg-blue-400 p-5'>
                <div className='row bg-white text-black'>
                    <div><h4>Software Package</h4></div>
                    <hr />
                    <form className='p-2'>
                        <div className='flex'>
                            <p>Price* : $</p>
                            <p id='price'> {formData.price}</p>
                        </div>
                        <hr />
                        <div className='flex'>
                            <p>Payment Type* : </p>
                            <p id='paymentType'> {formData.paymentType}</p>
                        </div>
                        <hr />
                        <div className='flex'>
                            <p>Prefix* :</p>
                            <select name="" id="selectType" >
                                <option value="0">Please select</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                        <hr />
                        <div className='flex'>
                            <p>Name* :</p>
                            <input type="text" id='name' />
                        </div>
                        <hr />
                        <div className='flex'>
                            <p>Phone* : </p>
                            <input type="text" id='phone' />
                        </div>
                        <hr />
                        <div className='flex flex-col'>
                            <p>Address* : </p>
                            <textarea name="address" id="address" rows={1} ></textarea>
                        </div>
                        <hr />
                        <button type='submit' className='bg-gray-500 w-full'> Buy</button>
                    </form>
                </div>
            </div>
            <div className='flex justify-center items-center'>
                <div className=' bg-blue-400 text-black p-4 flex justify-center items-center'>
                    <div className='bg-white rounded-md p-4'>
                        <h1 className='text-2xl font-bold'>Receipt</h1>
                        <hr />
                        <div className='flex'>
                            <p>Price : $</p>
                            <p id='receiptPrice'>{formData.price}</p>
                            <p id='receiptPackage'></p>
                        </div>
                        <hr />
                        <div className='flex'>
                            <p>Payment Type : </p>
                            <p id='receiptPayment'></p>
                        </div>
                        <hr />
                        <div className='flex'>
                            <p>Prefix : </p>
                            <p id='receiptPrefix'></p>
                        </div>
                        <hr />
                        <div className='flex'>
                            <p>Name : </p>
                            <p id='receiptName'></p>
                        </div>
                        <hr />
                        <div className='flex'>
                            <p>Phone : </p>
                            <p id='receiptPhone'></p>
                        </div>
                        <hr />
                        <div className='flex'>
                            <p>Address : </p>
                            <p id='receiptAddress'></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}