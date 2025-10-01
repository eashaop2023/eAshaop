import React, { useEffect, useState } from "react";
import { Form, Card, Button, Image, Badge, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './FilterSidebar.css';
import locationIcon from '../../../assets/pharmacyicons/location.svg'
import searchIcon from "../../../assets/pharmacyicons/search.svg";
import microphoneIcon from "../../../assets/pharmacyicons/microphone.svg";
import cartIcon from "../../../assets/pharmacyicons/Shopping_Cart_02.png";
import DoloImg from "../../../assets/pharmacyicons/Tablets.svg";
import Sidebar from '../../../components/categorypage/Sidebar';

const productList = [
  { id: 1, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
  { id: 2, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
  { id: 3, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
  { id: 4, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
  { id: 5, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
  { id: 6, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
  { id: 7, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
  { id: 8, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
  { id: 9, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
  { id: 10, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
  { id: 11, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
  { id: 12, name: "Paracetamol Tablets IP 500 mg", mrp: 700, price: 500 },
];

const CheckboxList = ({ items, type, selectedItems, onChange }) => (
  <div style={{ maxHeight: "170px", overflowY: "auto" }}>
    <Form>
      {items.map((item) => (
        <Form.Check
          key={item}
          type="checkbox"
          id={`${type}-${item}`}
          label={item}
          className="filter-checkbox"
          checked={selectedItems.includes(item)}
          onChange={() => onChange(type, item)}
          style={{ fontSize: "17px", marginBottom: "0.5rem" }}
        />
      ))}
    </Form>
  </div>
);

const FiltersSidebar = () => {
  const [selectedLocation, setSelectedLocation] = useState("500031, Nizambad");
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    brand: [],
  });

    const navigate=useNavigate();
  const handleCheckout=()=>{
    navigate('.././mycart');
  }

   const handleCard=()=>{
    navigate('../details');
  }


  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const totalCartItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleAddToCart = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleIncrement = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const handleDecrement = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => {
      const alreadySelected = prev[type].includes(value);
      return {
        ...prev,
        [type]: alreadySelected
          ? prev[type].filter((item) => item !== value)
          : [...prev[type], value],
      };
    });
  };

  const handleRemoveFilter = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== value),
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({ category: [], brand: [] });
  };

  const locations = [
    "500031, Nizambad",
    "500097, Almasguda",
    "500001, Hyderabad",
    "500055, Ameerpet",
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleLocationDropdown = () => {
    setShowLocationDropdown(!showLocationDropdown);
  };

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    setShowLocationDropdown(false);
  };

  const cartItems = productList.filter((item) => cart[item.id]);

  const toggleMobileFilters = () => setShowMobileFilters(!showMobileFilters);

  return (
    <div
      className="filters-sidebar-wrapper"
      style={{ display: "flex", position: "relative" }}
    >
      {/* Filters Sidebar (hidden on mobile/tablet) */}
      <div
        className="filters-sidebar"
        style={{
          width: "330px",
          padding: "30px 30px 30px 65px",
          backgroundColor: "#fff",
          position: "fixed",
          left: 0,
          top: "65px",
          bottom: 0,
          overflowY: "hidden",
          zIndex: 1000,
        }}
      >
        <h4 className="mb-4 fw-semibold">Filters</h4>
        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h6
            style={{
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "16px",
              borderBottom: "1px solid #EEEEEE",
              paddingBottom: "8px",
            }}
          >
            Category
          </h6>
          <CheckboxList
            items={[
              "Fever & Cold Relief",
              "Pain Management",
              "Digestive Health",
              "Diabetes Care",
              "Heart & BP Care",
              "Skin & Hair Care",
              "Allergy Relief",
            ]}
            type="category"
            selectedItems={selectedFilters.category}
            onChange={handleFilterChange}
          />
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h6
            style={{
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "16px",
              borderBottom: "1px solid #EEEEEE",
              paddingBottom: "8px",
            }}
          >
            Brands
          </h6>
          <CheckboxList
            items={[
              "Clear",
              "Croch",
              "Dolo 650",
              "Colpol",
              "Coldrex",
              "Sincrest",
              "Zincovit",
              "Ncip",
            ]}
            type="brand"
            selectedItems={selectedFilters.brand}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        className="main-content"
        style={{
          paddingLeft: "0px",
          marginLeft: "310px",
          width: "calc(100% - 320px)",
          position: "absolute",
          top: "30px",
        }}
      >
        {/* Fixed Header Container */}
        <div
          className="fixed-header-container"
          style={{
            position: "fixed",
            top: "77px",
            right: 0,
            left: "310px",
            backgroundColor: "#fff",
            zIndex: 1000,
            padding: "25px 30px 0px 30px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search and Cart Row */}
          <div className="d-flex flex-wrap gap-3" style={{ width: "100%" }}>
            {/* Original Search Bar */}
            <div
              className="search-bar d-flex align-items-center bg-transparent rounded-pill px-3"
              style={{
                width: "55%",
                maxWidth: "950px",
                border: "1px solid #8E8E8E",
                height: "56px",
              }}
            >
              <img src={locationIcon} alt="Location" width="18" />
              <div className="dropdown ms-2 location-dropdown-wrapper">
                <button
                  className="btn btn-sm dropdown-toggle"
                  type="button"
                  onClick={toggleLocationDropdown}
                  style={{
                    fontSize: "18px",
                    color: "#00A99D",
                    background: "none",
                    border: "none",
                    padding: 0,
                    boxShadow: "none",
                  }}
                >
                  {selectedLocation.split(",")[0]},
                  <span style={{ color: "#00A99D" }}>
                    {" "}
                    {selectedLocation.split(",")[1]}
                  </span>
                </button>
                {showLocationDropdown && (
                  <ul
                    className="dropdown-menu show"
                    style={{
                      border: "none",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      padding: 0,
                    }}
                  >
                    {locations.map((loc, index) => (
                      <li key={index}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleLocationSelect(loc)}
                          style={{
                            color: "#00A99D",
                            backgroundColor: "white",
                            fontSize: "18px",
                            padding: "8px 16px",
                          }}
                        >
                          {loc.split(",")[0]},
                          <span style={{ color: "#00A99D" }}>
                            {" "}
                            {loc.split(",")[1]}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <span className="mx-2">|</span>
              <img src={searchIcon} alt="Search" width="18" />
              <input
                type="text"
                className="form-control border-0 ms-2"
                placeholder="Search for"
                style={{
                  fontSize: "18px",
                  backgroundColor: "transparent",
                }}
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <img src={microphoneIcon} alt="Mic" width="18" className="ms-2" />
            </div>

            <button
              className="btn rounded-pill px-5 fw-regular"
              style={{
                backgroundColor: "#00A99D",
                color: "#fff",
                height: "56px",
              }}
            >
              Search
            </button>

            {/* Cart Button */}
            <button
              className="cart-button"
              style={{
                color: "#00A99D",
                border: "none",
                fontSize: "31px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                position: "relative",
              }}
              onClick={() => setShowCart(true)}
            >
              <img
                src={cartIcon}
                alt="Cart"
                width="34"
                height="28"
                style={{
                  filter:
                    "invert(51%) sepia(97%) saturate(399%) hue-rotate(132deg) brightness(94%) contrast(92%)",
                }}
              />
              Cart
              {totalCartItems > 0 && (
                <Badge
                  pill
                  className="custom-badge"
                  style={{
                    backgroundColor: "#00A99D",
                    color: "#fff",
                    position: "absolute",
                    top: "8px",
                    right: "65px",
                    fontSize: "12px",
                  }}
                >
                  {totalCartItems}
                </Badge>
              )}
            </button>
          </div>

          {/* Selected Filters */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              margin: "15px 0 10px 0",
              alignItems: "center",
            }}
          >
            {(selectedFilters.category.length > 0 ||
              selectedFilters.brand.length > 0) && (
              <button
                onClick={clearAllFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "#00A99D",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Clear All
              </button>
            )}
            {["category", "brand"].flatMap((type) =>
              selectedFilters[type].map((item) => (
                <div
                  key={item}
                  style={{
                    backgroundColor: "#e0e0e0",
                    borderRadius: "28px",
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                  }}
                >
                  {item}
                  <button
                    onClick={() => handleRemoveFilter(type, item)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "16px",
                      marginLeft: "8px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Product Cards */}
        <div
          style={{
            padding: "10px",
            marginTop: "160px",
            fontFamily: "Urbanist, sans-serif",
            marginLeft: "-45px",
          }}
        >
          <div
            className="product-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(266px, 1fr))",
              gap: "24px",
              paddingLeft: "35px",
            }}
          >
            {productList.map((item) => {
              const quantity = cart[item.id] || 0;
              return (
                <Card
                  key={item.id}
                 
                  style={{
                    width: isMobile ? "190px" : "266px",
                    height: isMobile ? "300px" : "370px",
                    borderRadius: "16px",
                    paddingTop: "24px",
                    paddingBottom: "24px",
                    paddingInline: "12px",
                    border: "1px solid #EEEEEE",
                    position: "relative",
                    backgroundColor: "#FFFFFF",
                    justifySelf: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "0px",
                      backgroundColor: "#1F405E",
                      color: "#fff",
                      fontSize: "12px",
                      borderRadius: "4px 0px 0px 4px",
                      padding: "2px 8px 0px 13px",
                      fontWeight: 500,
                      height: "20px",
                      width: "71px",
                    }}
                  >
                    15% OFF
                  </div>

                  <Image
                    src={DoloImg}
                    alt="Product"
                    onClick={handleCard}
                    fluid
                    style={{
                      borderRadius: "6px",
                      marginBottom: "10px",
                      width: "244px",
                      height: "144px",
                    }}
                  />

                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      marginBottom: "8px",
                      maxWidth: "228px",
                      height: "44px",
                      lineHeight: "120%",
                      whiteSpace: "normal",
                      paddingLeft: "16px",
                    }}
                  >
                    {item.name}
                  </div>

                  <hr style={{ color: "#EEEEEE", marginTop: 10 }} />

                  <div style={{ marginBottom: "16px", fontSize: "15px" }}>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#999",
                        marginRight: "6px",
                        paddingLeft: "16px",
                      }}
                    >
                      ₹{item.mrp}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: "18px" }}>
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Add to Cart / Counter */}
                  {quantity === 0 ? (
                    <Button
                      onClick={() => handleAddToCart(item.id)}
                      style={{
                        backgroundColor: "#00A99D",
                        border: "none",
                        borderRadius: "30px",
                        fontSize: isMobile ? "14px" : "16px",
                        fontWeight: 500,
                        padding: "8px 12px",
                        width: isMobile ? "120px" : "180px",
                        height: "40px",
                        marginLeft: isMobile ? "12px" : "24px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Add to cart
                    </Button>
                  ) : (
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        border: "1px solid #00A99D",
                        borderRadius: "30px",
                        width: isMobile ? "120px" : "180px",
                        marginLeft: isMobile ? "8px" : "24px",
                        height: "40px",
                        paddingInline: "10px",
                      }}
                    >
                      <Button
                        variant="light"
                        onClick={() => handleDecrement(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#00A99D",
                          fontSize: "20px",
                        }}
                      >
                        −
                      </Button>
                      <span style={{ fontSize: "16px", fontWeight: "600" }}>
                        {quantity}
                      </span>
                      <Button
                        variant="light"
                        onClick={() => handleIncrement(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#00A99D",
                          fontSize: "20px",
                        }}
                      >
                        +
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* MOBILE/TABLET Filter container */}
        <div
          className={`mobile-filter-container ${showMobileFilters ? "show" : ""}`}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h6
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "16px",
                borderBottom: "1px solid #EEEEEE",
                paddingBottom: "8px",
              }}
            >
              Category
            </h6>
            <CheckboxList
              items={[
                "Fever & Cold Relief",
                "Pain Management",
                "Digestive Health",
                "Diabetes Care",
                "Heart & BP Care",
                "Skin & Hair Care",
                "Allergy Relief",
              ]}
              type="category"
              selectedItems={selectedFilters.category}
              onChange={handleFilterChange}
            />
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <h6
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "16px",
                borderBottom: "1px solid #EEEEEE",
                paddingBottom: "8px",
              }}
            >
              Brands
            </h6>
            <CheckboxList
              items={[
                "Clear",
                "Croch",
                "Dolo 650",
                "Colpol",
                "Coldrex",
                "Sincrest",
                "Zincovit",
                "Ncip",
              ]}
              type="brand"
              selectedItems={selectedFilters.brand}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Cart Modal */}
        <Modal show={showCart} onHide={() => setShowCart(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Your Cart ({totalCartItems})</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cartItems.length > 0 ? (
              <div>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div>
                      <h6>{item.name}</h6>
                      <div>
                        ₹{item.price} x {cart[item.id]} = ₹
                        {item.price * cart[item.id]}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleDecrement(item.id)}
                        style={{ width: "30px", height: "30px", padding: 0 }}
                      >
                        -
                      </Button>
                      <span>{cart[item.id]}</span>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleIncrement(item.id)}
                        style={{ width: "30px", height: "30px", padding: 0 }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    marginTop: "20px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  Total: ₹
                  {cartItems.reduce(
                    (sum, item) => sum + item.price * cart[item.id],
                    0
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                Your cart is empty
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCart(false)}>
              Continue Shopping
            </Button>
            {cartItems.length > 0 && (
              <Button
                variant="primary"
                style={{ backgroundColor: "#00A99D", borderColor: "#00A99D" }}
                onClick={()=>handleCheckout()}
              >
                Proceed to Checkout
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* MOBILE/TABLET Top Bar for location, cart, filter */}
        <div className="mobile-top-bar">
          <div className="location-dropdown-wrapper-mobile">
            <img src={locationIcon} alt="Location" width="18" />
            <div className="dropdown ms-2">
              <button
                className="btn btn-sm dropdown-toggle"
                type="button"
                onClick={toggleLocationDropdown}
                style={{
                  fontSize: "18px",
                  color: "#00A99D",
                  background: "white",
                  border: "none",
                  padding: 0,
                  boxShadow: "none",
                }}
              >
                {selectedLocation.split(",")[0]},
                <span style={{ color: "#00A99D" }}>
                  {" "}
                  {selectedLocation.split(",")[1]}
                </span>
              </button>
              {showLocationDropdown && (
                <ul
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 1100,
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    padding: 0,
                    marginTop: "5px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    width: "100%",
                    backgroundColor: "white",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {locations.map((loc, index) => (
                    <li key={index} style={{ width: "100%" }}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleLocationSelect(loc)}
                        style={{
                          color: "#00A99D",
                          backgroundColor: "white",
                          fontSize: "16px",
                          padding: "12px 16px",
                          width: "100%",
                          textAlign: "left",
                          border: "none",
                          borderBottom:
                            index !== locations.length - 1
                              ? "1px solid #eee"
                              : "none",
                        }}
                      >
                        {loc.split(",")[0]},
                        <span style={{ color: "#00A99D" }}>
                          {" "}
                          {loc.split(",")[1]}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

           <button
          className="cart-button-mobile"
          style={{
            color: "#00A99D",
            border: "none",
            fontSize: isMobile ? "16px" : "31px", // Smaller font on mobile
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "none",
            position: "relative",
            padding: isMobile ? "0px" : "0", // Add padding on mobile
          }}
          onClick={() => setShowCart(true)}
        >
          <div style={{ position: "relative" }}>
            <img
              src={cartIcon}
              alt="Cart"
              width={isMobile ? "34" : "34"}
              height={isMobile ? "28" : "28"}
              style={{
                filter: "invert(51%) sepia(97%) saturate(399%) hue-rotate(132deg) brightness(94%) contrast(92%)",
              }}
            />
            {totalCartItems > 0 && (
              <Badge
                pill
                className="custom-badge"
                style={{
                  backgroundColor: "#00A99D",
                  color: "#fff",
                  position: "absolute",
                  top: "6px",
                  right: "-3px",
                  fontSize: "10px",
                  minWidth: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {totalCartItems}
              </Badge>
            )}
          </div>
          <span>Cart</span>
        </button>
          {/* Filter Button */}
          <button
            className="mobile-filter-toggle-btn"
            onClick={toggleMobileFilters}
          >
            <img src={filterIcon} alt="Filter" width="20" />
            <span>Filter</span>
          </button>
        </div>

        {/* MOBILE/TABLET Search Row */}
        <div className="mobile-search-row">
          <div
            className="d-flex align-items-center bg-transparent rounded-pill px-3"
            style={{
              border: "1px solid #F7F7F7",
              height: "48px",
              flexGrow: 1,
            }}
          >
            <img src={searchIcon} alt="Search" width="18" />
            <input
              type="text"
              className="form-control border-0 ms-2"
              placeholder="Search for"
              style={{
                fontSize: "14px",
                backgroundColor: "transparent",
              }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <img src={microphoneIcon} alt="Mic" width="18" className="ms-2" />
          </div>

          <button
            className="btn rounded-pill px-5 fw-regular ms-2"
            style={{
              backgroundColor: "#00A99D",
              color: "#fff",
              height: "48px",
            }}
          >
            Search
          </button>
        </div>
      /</div>
    </div>
  );
};

export default FiltersSidebar;