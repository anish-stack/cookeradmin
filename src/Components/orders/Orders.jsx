import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [adminOrders, setAdminOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10); // Number of orders per page
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); // State variable for selected order status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.camrosteel.com/api/v1/admin-order');
        setAdminOrders(response.data.data);
        setFilteredOrders(response.data.data);
        console.log(response.data.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const truncateDescription = (desc) => {
    const words = desc.split(' ');
    if (words.length <= 5) {
      return desc;
    }
    return words.slice(0, 5).join(' ') + '...';
  };
  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Filter orders based on search text and selected order status
  useEffect(() => {
    const filtered = adminOrders.filter(order =>
      order.product[0].name.toLowerCase().includes(searchText.toLowerCase()) &&
      (selectedStatus === '' || order.orderStatus === selectedStatus)
    );
    setFilteredOrders(filtered);
  }, [searchText, selectedStatus, adminOrders]);

  // Function to handle status filter change
  const handleStatusFilterChange = e => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-4">Admin Orders</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by product name"
          className="border rounded p-2 mr-4"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <select
          value={selectedStatus}
          onChange={handleStatusFilterChange}
          className="border rounded p-2"
        >
          <option value="">All Status</option>
          <option value="Pending">Order Confirmation Pending</option>
          <option value="Confirmed">Confirmed order</option>
          <option value="Packed">Packed</option>
          <option value="Dispatched">Order Dispatch</option>
          <option value="Returned">Order Return</option>


        </select>
      </div>
      <div className='w-full overflow-scroll'>

      <table className="w-[1400px] overflow-scroll divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Payment method</th>
            <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Transication</th>


            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentOrders.map(order => (
            <React.Fragment key={order._id}>
              {order.product.map((product, index) => (
                <tr key={`${order._id}_${index}`}>
                  {index === 0 ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap hide " rowSpan={order.product.length}><Link className='hide' to={`/Orders/${order._id}`}>{order._id}</Link></td>
                      <td className="px-6 py-4 whitespace-nowrap" rowSpan={order.product.length}>{order.product.length > 1 ? 'Multiple Products' : product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">Rs {product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><img src={product.image[0]} alt={product.name} className="h-10 w-10 object-cover" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"> {order.PyamentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap"> {order.transactionId || "COD"}</td>


                      

                      <td className="px-6 py-4 whitespace-nowrap">Rs {order.TotalAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.orderStatus}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">Rs {product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><img src={product.image[0]} alt={product.name} className="h-10 w-10 object-cover" /></td>
                    </>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      </div>
      <div className="mt-4 ml-5">
        {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Orders