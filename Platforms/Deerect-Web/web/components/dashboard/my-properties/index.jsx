'use client';

import DefaultHeader from "../../common/header/DefaultHeader";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { redirect } from 'next/navigation';

// Import the EditForm component
import EditForm from './EditForm';

const Index = () => {
  const supabase = createClient();

  // State Variables
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State variable for the current user's ID
  const [userId, setUserId] = useState(null);

  // State variable to manage which listing is being edited
  const [editingListingId, setEditingListingId] = useState(null);

  // Predefined State Abbreviations
  const stateAbbreviations = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  // Form Schema for Validation
  const formSchema = z.object({
    search: z.string().optional(),
    status: z.string().optional(),
    date: z.string().optional(),
    state: z.string().optional(),
  });

  // React Hook Form
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
  });

  // Fetch Data Function
  const fetchData = async (data) => {
    if (!userId) {
      setError('User not authenticated.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build the query
      let query = supabase.from('Listing').select('*').eq('owner_id', userId);

      // Apply search term
      if (data.search) {
        query = query.ilike('property_address', `%${data.search}%`);
      }

      // Apply status filter
      if (data.status) {
        query = query.eq('status', data.status);
      }

      // Apply date filter
      if (data.date === 'Most Recent') {
        query = query.order('created_at', { ascending: false });
      } else if (data.date === 'Oldest') {
        query = query.order('created_at', { ascending: true });
      }

      // Apply state filter
      if (data.state) {
        query = query.eq('state', data.state);
      }

      // Execute the query
      const { data: fetchedData, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setListings(fetchedData);
      }
    } catch (err) {
      setError('Error fetching data');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Submission
  const onSubmit = (data) => {
    fetchData(data);
  };

  // Fetch current user ID on component mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error('Error fetching user:', error);
        // Redirect to login page
        redirect('/login');
      } else {
        setUserId(user.id);
      }
    };

    getUser();
  }, []);

  // Fetch data when userId is set
  useEffect(() => {
    if (userId) {
      fetchData({});
    }
  }, [userId]);

  // Function to toggle edit mode
  const toggleEdit = (id) => {
    if (editingListingId === id) {
      setEditingListingId(null);
    } else {
      setEditingListingId(id);
    }
  };

  // Function to update listings after edit
  const updateListing = (id, updatedData) => {
    setListings((prevListings) =>
      prevListings.map((listing) =>
        listing.id === id ? { ...listing, ...updatedData } : listing
      )
    );
    setEditingListingId(null);
  };

  const handleDeleteListing = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this listing?');
    if (!confirmDelete) {
      return;
    }
  
    try {
      const { error } = await supabase
        .from('Listing')
        .delete()
        .eq('id', id);
  
      if (error) {
        console.error('Error deleting listing:', error);
        setError('Failed to delete the listing.');
        return;
      }
  
      setListings((prevListings) => prevListings.filter((listing) => listing.id !== id));
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while deleting the listing.');
    }
  };

  // Table Headers
  const theadContent = [
    "Listing Title",
    "Date Published",
    "Status",
    "Type",
    "Action",
  ];

  // Table Body Content
  const tbodyContent = listings.map((item) => (
    <React.Fragment key={item.id}>
      <tr>
        <td scope="row">
          <div className="feat_property list favorite_page style2">
            <div className="details">
              <div className="tc_content">
                <h4>{item.property_address}</h4>
                <p>
                  <span className="flaticon-placeholder"></span>
                  {item.city}, {item.state}, {item.zip_code}
                </p>
                <a className="fp_price text-thm" href="#">
                  Property Value: ${item.property_value}
                </a>
              </div>
            </div>
          </div>
        </td>
        <td>{new Date(item.created_at).toLocaleDateString()}</td>
        <td>
          <span className="status_tag badge">{item.status}</span>
        </td>
        <td>{item.property_type}</td>
        <td>
          <ul className="view_edit_delete_list mb0">
            <li
              className="list-inline-item"
              data-toggle="tooltip"
              data-placement="top"
              title={editingListingId === item.id ? 'Close' : 'Edit'}
              onClick={() => toggleEdit(item.id)}
            >
              <a href="#">
                <span className={editingListingId === item.id ? 'flaticon-close' : 'flaticon-edit'}></span>
              </a>
            </li>
            {/* Delete button */}
            <li
              className="list-inline-item"
              data-toggle="tooltip"
              data-placement="top"
              title="Delete"
              onClick={() => handleDeleteListing(item.id)}
            >
              <a href="#">
                <span className="flaticon-garbage"></span>
              </a>
            </li>
          </ul>
        </td>
      </tr>
      {/* Edit Form Row */}
      {editingListingId === item.id && (
        <tr>
          <td colSpan="5">
            <div style={{ border: '2px solid red', padding: '10px' }}>
              <EditForm
                item={item}
                supabase={supabase}
                updateListing={updateListing}
                setError={setError}
                stateAbbreviations={stateAbbreviations}
              />
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ));

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <DefaultHeader />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu />
        </div>
      </div>
      {/* End sidebar_menu */}

      {/* <!-- Our Dashboard --> */}
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                {/* Start Dashboard Navigation */}
                <div className="col-lg-12">
                  <div className="dashboard_navigationbar dn db-1024">
                    <div className="dropdown">
                      <button
                        className="dropbtn"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#DashboardOffcanvasMenu"
                        aria-controls="DashboardOffcanvasMenu"
                      >
                        <i className="fa fa-bars pr10"></i> Dashboard Navigation
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Dashboard Navigation */}

                <div className="col-lg-4 col-xl-4 mb10">
                  <div className="breadcrumb_content style2 mb30-991">
                    <h2 className="breadcrumb_title">My Properties</h2>
                    <p>We are glad to see you again!</p>
                  </div>
                </div>
                {/* End .col */}

                <div className="col-lg-8 col-xl-8">
                  <div className="candidate_revew_select style2 text-end mb30-991">
                    <ul className="mb0">
                      <li className="list-inline-item w-100">
                        {/* Search and Filters Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-wrap align-items-center my-2">
                          {/* Search Input */}
                          <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search by Address"
                            aria-label="Search"
                            {...register('search')}
                          />

                          {/* Date Filter */}
                          <select {...register('date')} className="form-select c_select me-2">
                            <option value="">No Date Filter</option>
                            <option value="Most Recent">Most Recent</option>
                            <option value="Oldest">Oldest</option>
                          </select>

                          {/* Status Filter */}
                          <select {...register('status')} className="form-select c_select me-2">
                            <option value="">No Status Filter</option>
                            <option value="Active">Active</option>
                            <option value="Sold">Sold</option>
                            <option value="Pending">Pending</option>
                          </select>

                          {/* State Filter */}
                          <select {...register('state')} className="form-select c_select me-2">
                            <option value="">All States</option>
                            {stateAbbreviations.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>

                          <button className="btn btn-primary my-2 my-sm-0" type="submit">
                            Search
                          </button>
                        </form>
                      </li>
                      {/* End li */}
                    </ul>
                  </div>
                </div>
                {/* End .col */}

                <div className="col-lg-12">
                  <div className="my_dashboard_review mb40">
                    <div className="property_table">
                      <div className="table-responsive mt0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {loading ? (
                          <p>Loading...</p>
                        ) : error ? (
                          <p className="text-danger">{error}</p>
                        ) : listings.length > 0 ? (
                          <table className="table">
                            <thead className="thead-light">
                              <tr>
                                {theadContent.map((value, i) => (
                                  <th scope="col" key={i}>
                                    {value}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            {/* End thead */}

                            <tbody>{tbodyContent}</tbody>
                          </table>
                        ) : (
                          <p>No Listings Found</p>
                        )}
                      </div>
                      {/* End .table-responsive */}
                    </div>
                    {/* End .property_table */}
                  </div>
                </div>
                {/* End .col */}
              </div>
              {/* End .row */}

              {/* Footer */}
              <div className="row mt50">
                <div className="col-lg-12">
                  <div className="copyright-widget text-center">
                    <p>© {new Date().getFullYear()} Deerect. Made with love.</p>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
