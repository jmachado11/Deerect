import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Props: item, supabase, updateListing, setError, stateAbbreviations
const EditForm = ({ item, supabase, updateListing, setError, stateAbbreviations }) => {
  // Validation schema for the edit form
  const editFormSchema = z.object({
    tax_type: z.string().nonempty({ message: "Tax Type is required" }),
    property_tax_id_number: z.number().positive({ message: "Tax ID Number must be a positive integer" }).int({ message: "Tax ID Number must be an integer" }),
    description: z.string().optional(),
    amount_owed: z.number().positive({ message: "Amount Owed must be a positive integer" }).int({ message: "Amount Owed must be an integer" }),
    redemption_date: z.string().optional(),
    date_acquired: z.string().optional(),
    interest_rate: z.number().positive({ message: "Interest Rate must be a positive number" }),
    parcel_number: z.string().nonempty({ message: "Parcel Number is required" }),
    property_value: z.number().positive({ message: "Property Value must be a positive integer" }).int({ message: "Property Value must be an integer" }),
    property_type: z.string().nonempty({ message: "Property Type is required" }),
    property_condition: z.string().nonempty({ message: "Property Condition is required" }),
    property_address: z.string().nonempty({ message: "Street Address is required" }),
    county: z.string().nonempty({ message: "County is required" }),
    city: z.string().nonempty({ message: "City is required" }),
    state: z.string().nonempty({ message: "State is required" }),
    zip_code: z.string().nonempty({ message: "Zip Code is required" }),
    amenities: z.array(z.string()).optional(),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      tax_type: item.tax_type || '',
      property_tax_id_number: item.property_tax_id_number || '',
      description: item.description || '',
      amount_owed: item.amount_owed || '',
      redemption_date: item.redemption_date ? item.redemption_date.split('T')[0] : '',
      date_acquired: item.date_acquired ? item.date_acquired.split('T')[0] : '',
      interest_rate: item.interest_rate || '',
      parcel_number: item.parcel_number || '',
      property_value: item.property_value || '',
      property_type: item.property_type || '',
      property_condition: item.property_condition || '',
      property_address: item.property_address || '',
      county: item.county || '',
      city: item.city || '',
      state: item.state || '',
      zip_code: item.zip_code || '',
      amenities: item.amenities || [],
    },
  });

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('Listing')
        .update({
          ...data,
          redemption_date: data.redemption_date || null,
          date_acquired: data.date_acquired || null,
        })
        .eq('id', item.id);

      if (error) {
        console.error('Error updating listing:', error);
        setError('Failed to update the listing.');
      } else {
        updateListing(item.id, data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while updating the listing.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="edit-listing-form">
      <div className="row">
        {/* Tax Type */}
        <div className="col-md-6">
          <div className="form-group">
            <label>Tax Type</label>
            <select {...register('tax_type')} className="form-control">
              <option value="">Select Tax Type</option>
              <option value="Tax Lien">Tax Lien</option>
              <option value="Tax Deed">Tax Deed</option>
            </select>
            {errors.tax_type && <p className="text-danger">{errors.tax_type.message}</p>}
          </div>
        </div>
        {/* Property Tax ID Number */}
        <div className="col-md-6">
          <div className="form-group">
            <label>Tax ID Number</label>
            <input
              type="number"
              {...register('property_tax_id_number', { valueAsNumber: true })}
              className="form-control"
            />
            {errors.property_tax_id_number && <p className="text-danger">{errors.property_tax_id_number.message}</p>}
          </div>
        </div>
        {/* Description */}
        <div className="col-md-12">
          <div className="form-group">
            <label>Description</label>
            <textarea
              {...register('description')}
              className="form-control"
              rows="3"
            ></textarea>
            {errors.description && <p className="text-danger">{errors.description.message}</p>}
          </div>
        </div>
        {/* Amount Owed */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Amount Owed</label>
            <input
              type="number"
              {...register('amount_owed', { valueAsNumber: true })}
              className="form-control"
            />
            {errors.amount_owed && <p className="text-danger">{errors.amount_owed.message}</p>}
          </div>
        </div>
        {/* Redemption Date */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Redemption Date</label>
            <input
              type="date"
              {...register('redemption_date')}
              className="form-control"
            />
            {errors.redemption_date && <p className="text-danger">{errors.redemption_date.message}</p>}
          </div>
        </div>
        {/* Date Acquired */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Date Acquired</label>
            <input
              type="date"
              {...register('date_acquired')}
              className="form-control"
            />
            {errors.date_acquired && <p className="text-danger">{errors.date_acquired.message}</p>}
          </div>
        </div>
        {/* Interest Rate */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Interest Rate</label>
            <input
              type="number"
              {...register('interest_rate', { valueAsNumber: true })}
              className="form-control"
            />
            {errors.interest_rate && <p className="text-danger">{errors.interest_rate.message}</p>}
          </div>
        </div>
        {/* Parcel Number */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Parcel Number</label>
            <input
              type="text"
              {...register('parcel_number')}
              className="form-control"
            />
            {errors.parcel_number && <p className="text-danger">{errors.parcel_number.message}</p>}
          </div>
        </div>
        {/* Property Value */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Property Value</label>
            <input
              type="number"
              {...register('property_value', { valueAsNumber: true })}
              className="form-control"
            />
            {errors.property_value && <p className="text-danger">{errors.property_value.message}</p>}
          </div>
        </div>
        {/* Property Type */}
        <div className="col-md-6">
          <div className="form-group">
            <label>Property Type</label>
            <select {...register('property_type')} className="form-control">
              <option value="">Select Property Type</option>
              <option value="House">House</option>
              <option value="Building">Building</option>
              <option value="Business">Business</option>
            </select>
            {errors.property_type && <p className="text-danger">{errors.property_type.message}</p>}
          </div>
        </div>
        {/* Property Condition */}
        <div className="col-md-6">
          <div className="form-group">
            <label>Property Condition</label>
            <select {...register('property_condition')} className="form-control">
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
        {/* Property Address */}
        <div className="col-md-12">
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              {...register('property_address')}
              className="form-control"
            />
            {errors.property_address && <p className="text-danger">{errors.property_address.message}</p>}
          </div>
        </div>
        {/* County */}
        <div className="col-md-4">
          <div className="form-group">
            <label>County</label>
            <input
              type="text"
              {...register('county')}
              className="form-control"
            />
            {errors.county && <p className="text-danger">{errors.county.message}</p>}
          </div>
        </div>
        {/* City */}
        <div className="col-md-4">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              {...register('city')}
              className="form-control"
            />
            {errors.city && <p className="text-danger">{errors.city.message}</p>}
          </div>
        </div>
        {/* State */}
        <div className="col-md-4">
          <div className="form-group">
            <label>State</label>
            <select {...register('state')} className="form-control">
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
        {/* Zip Code */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              {...register('zip_code')}
              className="form-control"
            />
            {errors.zip_code && <p className="text-danger">{errors.zip_code.message}</p>}
          </div>
        </div>
        {/* Amenities */}
        <div className="col-md-12">
          <div className="form-group">
            <label>Amenities</label>
            <ul className="list-inline">
              {/* Front Lawn */}
              <li className="list-inline-item">
                <div className="form-check">
                  <input
                    type="checkbox"
                    {...register('amenities')}
                    value="Front Lawn"
                    className="form-check-input"
                    id={`amenityFrontLawn-${item.id}`}
                    defaultChecked={item.amenities && item.amenities.includes('Front Lawn')}
                  />
                  <label className="form-check-label" htmlFor={`amenityFrontLawn-${item.id}`}>
                    Front Lawn
                  </label>
                </div>
              </li>
              {/* Backyard */}
              <li className="list-inline-item">
                <div className="form-check">
                  <input
                    type="checkbox"
                    {...register('amenities')}
                    value="Backyard"
                    className="form-check-input"
                    id={`amenityBackyard-${item.id}`}
                    defaultChecked={item.amenities && item.amenities.includes('Backyard')}
                  />
                  <label className="form-check-label" htmlFor={`amenityBackyard-${item.id}`}>
                    Backyard
                  </label>
                </div>
              </li>
              {/* Swimming Pool */}
              <li className="list-inline-item">
                <div className="form-check">
                  <input
                    type="checkbox"
                    {...register('amenities')}
                    value="Swimming Pool"
                    className="form-check-input"
                    id={`amenitySwimmingPool-${item.id}`}
                    defaultChecked={item.amenities && item.amenities.includes('Swimming Pool')}
                  />
                  <label className="form-check-label" htmlFor={`amenitySwimmingPool-${item.id}`}>
                    Swimming Pool
                  </label>
                </div>
              </li>
              {/* Add more amenities as needed */}
            </ul>
          </div>
        </div>
        {/* Update Button */}
        <div className="col-md-12">
          <button type="submit" className="btn btn-primary mt-2">
            Update
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditForm;
