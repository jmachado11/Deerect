'use client';
import DefaultHeader from "../../common/header/DefaultHeader";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  tax_type: z.string().nonempty({ message: "Tax Type is required" }),
  property_tax_id_number: z.preprocess((val) => {
    if (typeof val === 'string') {
      val = val.replace(/,/g, '').split('.')[0];
    }
    return Number(val);
  }, z.number().positive({ message: "Tax ID Number must be a positive integer" }).int({ message: "Tax ID Number must be an integer" })),
  description: z.string().optional(),
  
  amount_owed: z.preprocess((val) => {
    if (typeof val === 'string') {
      val = val.replace(/,/g, '').split('.')[0];
    }
    return Number(val);
  }, z.number().positive({ message: "Amount Owed must be a positive integer" }).int({ message: "Amount Owed must be an integer" })),
  redemption_date: z.preprocess((val) => new Date(val), z.date({ invalid_type_error: 'Redemption Date must be a valid date' })),
  date_acquired: z.preprocess((val) => new Date(val), z.date({ invalid_type_error: 'Date Acquired must be a valid date' }).max(new Date(), { message: "Date Acquired cannot be in the future" })),
  interest_rate: z.preprocess((val) => {
    if (typeof val === 'string') {
      val = val.replace(/,/g, '');
    }
    return Number(val);
  }, z.number().positive({ message: "Interest Rate must be a positive number" })),
  parcel_number: z.string().nonempty({ message: "Parcel Number is required" }),
  property_value: z.preprocess((val) => {
    if (typeof val === 'string') {
      val = val.replace(/,/g, '').split('.')[0];
    }
    return Number(val);
  }, z.number().positive({ message: "Property Value must be a positive integer" }).int({ message: "Property Value must be an integer" })),
  property_type: z.string().nonempty({ message: "Property Type is required" }),
  property_condition: z.string().nonempty({ message: "Property Condition is required" }),
  property_address: z.string().nonempty({ message: "Street Address is required" }),
  county: z.string().nonempty({ message: "County is required" }),
  city: z.string().nonempty({ message: "City is required" }),
  state: z.string().nonempty({ message: "State is required" }),
  zip_code: z.string().nonempty({ message: "Zip Code is required" }),
  amenities: z.array(z.string()).optional(),
});

const Index = () => {
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [formStatus, setFormStatus] = useState(null);
  const stateAbbreviations = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];
  

  const onSubmit = async (data) => {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error fetching user:', userError);
      redirect("/login");
    }

    const owner_id = user.id;

    // Check if tax ID number already exists
    const { data: existingListings, error: existingListingsError } = await supabase
      .from('Listing')
      .select('property_tax_id_number')
      .eq('property_tax_id_number', data.property_tax_id_number);

    if (existingListingsError) {
      console.error('Error checking existing listings:', existingListingsError);
      setFormStatus("Error Submitting, Try again later!");
      return;
    }
    console.log(existingListings)
    if (existingListings && existingListings.length > 0) {
      setFormStatus("This tax ID number is already exist. If this is an error, please contact us at deerect.net/contact");
      return;
    }

    // Prepare the data to insert
    const newListing = {
      owner_id,
      tax_type: data.tax_type,
      property_tax_id_number: data.property_tax_id_number,
      description: data.description,
      
      amount_owed: data.amount_owed,
      redemption_date: data.redemption_date.toISOString(), // Ensure correct format
      date_acquired: data.date_acquired.toISOString(),
      interest_rate: data.interest_rate,
      parcel_number: data.parcel_number,
      property_value: data.property_value,
      property_type: data.property_type,
      property_condition: data.property_condition,
      property_address: data.property_address,
      county: data.county,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      amenities: data.amenities || null,
    };

    // Insert into Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('Listing')
      .insert([newListing]);

    if (insertError) {
      if(insertError.message.includes("duplicate")){
        setFormStatus("This tax ID number already exist. If this is an error, please contact us at deerect.net/contact");
        return;
      }
      console.error('Error inserting listing:', insertError);
      setFormStatus("Error Submitting, Try again later!");
      // Handle error (e.g., display message to user)
    } else {
      console.log('Listing created:', newListing);
      setFormStatus("Listing created successfully!");

      // Redirect to my properties or reset the form
      redirect('/my-properties');
      // reset();
    }
  };

  // Check if user is logged in
  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.log(error);
        redirect("/login");
      }
    }
    fetchUser();
  }, []);

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

                <div className="col-lg-12 mb10">
                  <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Add New Property</h2>
                    <p>We are glad to see you again!</p>
                  </div>
                </div>
                {/* End .col */}

                {/* Begin Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="col-lg-12">
                    <div className="my_dashboard_review">
                      <div className="row">
                        <div className="col-lg-12">
                          <h3 className="mb30">Create Listing</h3>
                        </div>

                        {/* Tax Type */}
                        <div className="col-lg-6 col-xl-6">
                          <div className="my_profile_setting_input ui_kit_select_search form-group">
                            <label>Tax Type</label>
                            <select
                              {...register('tax_type')}
                              className="selectpicker form-select"
                              data-live-search="true"
                              data-width="100%"
                            >
                              <option value="">Select Tax Type</option>
                              <option value="Tax Lien">Tax Lien</option>
                              <option value="Tax Deed">Tax Deed</option>
                            </select>
                            {errors.tax_type && <p className="text-danger">{errors.tax_type.message}</p>}
                          </div>
                        </div>
                        {/* End .col */}

                        {/* Tax ID Number */}
                        <div className="col-lg-4 col-xl-4">
                          <div className="my_profile_setting_input form-group">
                            <label htmlFor="taxIdNumber">ID Number</label>
                            <input
                              type="number"
                              {...register('property_tax_id_number')}
                              className="form-control"
                              id="taxIdNumber"
                            />
                            {errors.property_tax_id_number && <p className="text-danger">{errors.property_tax_id_number.message}</p>}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="col-lg-12">
                          <div className="my_profile_setting_textarea">
                            <label htmlFor="propertyDescription">Description</label>
                            <textarea
                              placeholder="Enter any extra information about the property (Damages, Improvements, etc) or the Tax Lien/Deed"
                              className="form-control"
                              id="propertyDescription"
                              {...register('description')}
                              rows="7"
                            ></textarea>
                            {errors.description && <p className="text-danger">{errors.description.message}</p>}
                          </div>
                        </div>
                        {/* End .col */}

                        {/* Status */}
                        
                        {/* End .col */}

                        {/* Amount Owed */}
                        <div className="col-lg-4 col-xl-4">
                          <div className="my_profile_setting_input form-group">
                            <label htmlFor="amountOwed">Amount Owed</label>
                            <input
                              type="number"
                              {...register('amount_owed')}
                              className="form-control"
                              id="amountOwed"
                            />
                            {errors.amount_owed && <p className="text-danger">{errors.amount_owed.message}</p>}
                          </div>
                        </div>

                        {/* Redemption Date */}
                        <div className="col-lg-4 col-xl-4">
                          <div className="my_profile_setting_input form-group">
                            <label htmlFor="redemptionDate">Redemption Date</label>
                            <input
                              type="date"
                              {...register('redemption_date')}
                              className="form-control"
                              id="redemptionDate"
                            />
                            {errors.redemption_date && <p className="text-danger">{errors.redemption_date.message}</p>}
                          </div>
                        </div>
                        {/* End .col */}

                        {/* Date Acquired */}
                        <div className="col-lg-4 col-xl-4">
                          <div className="my_profile_setting_input form-group">
                            <label htmlFor="dateAcquired">Date Acquired</label>
                            <input
                              type="date"
                              {...register('date_acquired')}
                              className="form-control"
                              id="dateAcquired"
                            />
                            {errors.date_acquired && <p className="text-danger">{errors.date_acquired.message}</p>}
                          </div>
                        </div>
                        {/* End .col */}

                        {/* Interest Rate */}
                        <div className="col-lg-4 col-xl-4">
                          <div className="my_profile_setting_input form-group">
                            <label htmlFor="interestRate">Interest Rate</label>
                            <input
                              type="number"
                              {...register('interest_rate')}
                              className="form-control"
                              id="interestRate"
                            />
                            {errors.interest_rate && <p className="text-danger">{errors.interest_rate.message}</p>}
                          </div>
                        </div>
                        {/* End .col */}

                        {/* Parcel Number */}
                        <div className="col-lg-4 col-xl-4">
                          <div className="my_profile_setting_input form-group">
                            <label htmlFor="parcelNumber">Parcel Number</label>
                            <input
                              type="text"
                              {...register('parcel_number')}
                              className="form-control"
                              id="parcelNumber"
                            />
                            {errors.parcel_number && <p className="text-danger">{errors.parcel_number.message}</p>}
                          </div>
                        </div>

                        {/* Property Value */}
                        <div className="col-lg-4 col-xl-4">
                          <div className="my_profile_setting_input form-group">
                            <label htmlFor="propertyValue">Property Value</label>
                            <input
                              type="number"
                              {...register('property_value')}
                              className="form-control"
                              id="propertyValue"
                            />
                            {errors.property_value && <p className="text-danger">{errors.property_value.message}</p>}
                          </div>
                        </div>

                        {/* Property Type */}
                        <div className="col-lg-6 col-xl-6">
                          <div className="my_profile_setting_input ui_kit_select_search form-group">
                            <label>Property Type</label>
                            <select
                              {...register('property_type')}
                              className="selectpicker form-select"
                              data-live-search="true"
                              data-width="100%"
                            >
                              <option value="">Select Property Type</option>
                              <option value="House">Residential</option>
                              <option value="Commercial">Commercial</option>
                              <option value="Land">Land</option>
                            </select>
                            {errors.property_type && <p className="text-danger">{errors.property_type.message}</p>}
                          </div>
                        </div>

                        {/* Property Condition */}
                        <div className="col-lg-6 col-xl-6">
                          <div className="my_profile_setting_input ui_kit_select_search form-group">
                            <label>Property Condition</label>
                            <select
                              {...register('property_condition')}
                              className="selectpicker form-select"
                              data-live-search="true"
                              data-width="100%"
                            >
                              <option value="">Select Property Condition</option>
                              <option value="Great">Great</option>
                              <option value="Good">Good</option>
                              <option value="Ok">Ok</option>
                              <option value="Salvageable">Salvageable</option>
                              <option value="Abandoned">Abandoned</option>
                            </select>
                            {errors.property_condition && <p className="text-danger">{errors.property_condition.message}</p>}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Location Section */}
                    <div className="my_dashboard_review mt30">
                      <div className="row">
                        <div className="col-lg-12">
                          <h3 className="mb30">Location</h3>
                        </div>

                        {/* Street Address */}
                        <div className="col-lg-12">
                          <div className="my_profile_setting_input form-group">
                            <label htmlFor="propertyAddress">Street Address</label>
                            <input type="text" className="form-control" id="propertyAddress" {...register('property_address')} />
                            {errors.property_address && <p className="text-danger">{errors.property_address.message}</p>}
                          </div>
                        </div>
                        {/* End .col */}

                        {/* County */}
                        <div className="col-lg-6 col-xl-6">
                          <div className="my_profile_setting_input form-group">
                            <label htmlFor="county">County</label>
                            <input type="text" className="form-control" id="county" {...register('county')} />
                            {errors.county && <p className="text-danger">{errors.county.message}</p>}
                          </div>
                        </div>
                        {/* End .col */}

                        {/* City */}
                        <div className="col-lg-6 col-xl-6">
                          <div className="my_profile_setting_input form-group">
                            <label htmlFor="city">City</label>
                            <input type="text" className="form-control" id="city" {...register('city')} />
                            {errors.city && <p className="text-danger">{errors.city.message}</p>}
                          </div>
                        </div>
                        {/* End .col */}

                        {/* State */}
                        <div className="col-lg-4 col-xl-4">
                          <div className="my_profile_setting_input ui_kit_select_search form-group">
                            <label htmlFor="state">State</label>
                            <select
                              {...register('state')}
                              className="selectpicker form-select"
                              data-live-search="true"
                              data-width="100%"
                              id="state"
                            >
                              <option value="">Select State</option>
                              {stateAbbreviations.map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                            {errors.state && <p className="text-danger">{errors.state.message}</p>}
                          </div>
                        </div>
                        {/* End .col */}



                        {/* Zip Code */}
                        <div className="col-lg-4 col-xl-4">
                          <div className="my_profile_setting_input form-group">
                            <label htmlFor="zipCode">Zip Code</label>
                            <input type="text" className="form-control" id="zipCode" {...register('zip_code')} />
                            {errors.zip_code && <p className="text-danger">{errors.zip_code.message}</p>}
                          </div>
                        </div>
                        {/* End .col */}

                      </div>
                    </div>

                    {/* Amenities Section */}
                    <div className="my_dashboard_review mt30">
                      <div className="col-lg-12">
                        <h3 className="mb30">Extra Information</h3>
                      </div>

                      <div className="row">
                        {/* Amenities */}
                        <div className="col-xl-12">
                          <h4 className="mb10">Amenities</h4>
                        </div>

                        <div className="col-xxs-6 col-sm col-lg col-xl">
                          <ul className="ui_kit_checkbox selectable-list">
                            <li>
                              <div className="form-check custom-checkbox">
                                <input
                                  type="checkbox"
                                  {...register('amenities')}
                                  value="Front Lawn"
                                  className="form-check-input"
                                  id="amenityFrontLawn"
                                />
                                <label className="form-check-label" htmlFor="amenityFrontLawn">
                                  Front Lawn
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="form-check custom-checkbox">
                                <input
                                  type="checkbox"
                                  {...register('amenities')}
                                  value="Backyard"
                                  className="form-check-input"
                                  id="amenityBackyard"
                                />
                                <label className="form-check-label" htmlFor="amenityBackyard">
                                  Backyard
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="form-check custom-checkbox">
                                <input
                                  type="checkbox"
                                  {...register('amenities')}
                                  value="Swimming Pool"
                                  className="form-check-input"
                                  id="amenitySwimmingPool"
                                />
                                <label className="form-check-label" htmlFor="amenitySwimmingPool">
                                  Swimming Pool
                                </label>
                              </div>
                            </li>
                            {/* Add more amenities as needed */}
                          </ul>
                        </div>
                        {/* End .col */}

                        {/* Submit Button */}
                        <div className="col-xl-12">
                          <div className="my_profile_setting_input overflow-hidden mt20">
                            {formStatus && <p className="text-danger">{formStatus}</p>}
                            <button type="submit" className="btn btn2 float-end">Post</button>
                          </div>
                        </div>
                        {/* End .col */}
                      </div>
                    </div>
                  </div>
                </form>
                {/* End Form */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;

