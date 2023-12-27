import { useState } from "react";

const defaultFormData = {
  accountNumber: "",
  description: "",
  amount: "",
  currency: "SLSH",
};

export default function App() {
  const [formData, setFormData] = useState(defaultFormData);

  const { accountNumber, description, amount, currency } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
//Submit Function
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
        setFormData(formData);
        //API URL That Get Body and Send POST Request The Purchase
      const response = await fetch("http://localhost:3002/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle success response
        console.log("Form submitted successfully!");
        alert("Success");
      } else {
        // Handle error response
        console.log("Error submitting form:", response.statusText);
        alert("Error");
      }
    } catch (error) {
      // Handle network error
      console.log("Error submitting form:", error.message);
    }
    console.log(formData);
  };

  return (
    <>
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          width: " 50%",
          border: "3px solid green",
          padding: "20px",
        }}
      >
        <form onSubmit={onSubmit}>
          <h1>Payment Process</h1>
          <div className="form-group">
            <label htmlFor="currency">Select an Payment Type:</label>
            <br></br>
            <select
              id="currency"
              name="currency"
              value={currency}
              onChange={onChange}
            >
              <option value="SLSH">SLSH</option>

              <option value="USD">USD</option>
            </select>
          </div>
          <label htmlFor="AccountNumber">accountNumber</label>
          <br />
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={onChange}
          />
          <br />
          <br />
          <label htmlFor="Description">description</label>
          <br />
          <input
            type="text"
            id="description"
            value={description}
            onChange={onChange}
          />
          <br />
          <br />
          <label htmlFor="amount">amount</label>
          <br />
          <input type="number" id="amount" value={amount} onChange={onChange} />
          <br />
          <br />
          <button type="submit">Payment</button>
        </form>
      </div>
    </>
  );
}
