import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Loader from '../common/IsLoading'
import Script from 'next/script';

export default function AadharDetails({ proceedTo,updateKycProgress }) {
	const [msmedDetails, setMsmedDetails] = useState({});
	const [isLoading, setIsLoading] = useState(false)

	const { register, getValues, setValue, formState: { errors, isDirty, isValid, isSubmitting }, handleSubmit } = useForm({ mode: "all" });

	const saveMsmedDetails = (fields) => {
		const fd = new FormData();
		fd.append('visitingCardFront', fields.visitingCardFront[0]);
		fd.append('visitingCardBack', fields.visitingCardBack[0]);
		fd.append('bankName',fields.bankName);
		fd.append('bankAccountno',fields.bankAccountno);
		fd.append('ifscCode',fields.ifscCode);

		fetch('/api/users/profile/visiting-card-details', {
			method: "POST",
			body: fd
		})
			.then(async(rawResponse) => {
				if (rawResponse.ok) rawResponse.json()
				else throw await rawResponse.json()
			})
			.then(
				(response) => {
					alert('Bank Details Saved')
					updateKycProgress({ visitingCardDetails: 1 })
					proceedTo('profileSummary')
				}
			).catch(error => {
				alert(error.error)
			})
	}

	return (
		<>
			<Script
				src="/plugins/bs-custom-file-input/bs-custom-file-input.min.js"
				id="load-custom-input-visiting-cards"
				strategy="afterInteractive"
				onLoad={() => {
					bsCustomFileInput.init();
				}}
			/>
			<div className="card card-warning card-outline">
				<div className="card-header">
					<div className="card-title">
						Bank and Reimbursement  Details
					</div>
				</div>
				{isLoading ? <Loader /> :
					<form onSubmit={handleSubmit(saveMsmedDetails)}>
						<div className="card-body">
							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label htmlFor="exampleInputFile">Bank Details</label>
										<div className="input-group">
											<div className="custom-file">
												<input type="file" className={'custom-file-input ' + (errors.visitingCardFront ? ' is-invalid' : '')} id="visitingCardFront"
													{...register("visitingCardFront", {
														required: "visiting Card is Required",
														validate: {
															acceptedFormats:(value) => ['application/pdf', 'image/jpeg','image/jpg', 'image/png'].indexOf(value[0].type) > -1 || 'Only pdf, png, jpg,jpeg allowed',
															lessThan1MB: files => files[0]?.size < 1500000 || 'Max 1.5 MB allowed',
														}
													})}
												/>
												<label className="custom-file-label" htmlFor="exampleInputFile">Choose file</label>
											</div>
											{errors.visitingCardFront && (<div className="invalid-feedback d-block">{errors.visitingCardFront.message}</div>)}
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label htmlFor="exampleInputFile">Reimbursement Bill</label>
										<div className="input-group">
											<div className="custom-file">
												<input type="file" className={'custom-file-input ' + (errors.visitingCardBack ? ' is-invalid' : '')} id="visitingCardBack"
													{...register("visitingCardBack", {
														required: 'visiting Card back in required.',
														validate: {
															acceptedFormats:(value) => (value) => value[0] && ['application/pdf', 'image/jpeg','image/jpg', 'image/png'].indexOf(value[0].type) > -1 || 'Only pdf, png, jpg,jpeg allowed',
															lessThan1MB: files => files[0]?.size < 1500000 || 'Max 1.5 MB allowed',
														}
													})}
												/>
												<label className="custom-file-label" htmlFor="exampleInputFile">Choose file</label>
											</div>
											{errors.visitingCardBack && (<div className="invalid-feedback d-block">{errors.visitingCardBack.message}</div>)}
										</div>
									</div>
								</div>
							</div>
                                  
							<div className="col-md-6">
							<div className="row">
								<div className="form-group ">
									<label htmlFor="BankName">Bank Name <span className="required">*</span> </label>
									<input type="text" className={'form-control ' + (errors.bankName ? ' is-invalid' : '')} id="bankName" placeholder="Please Enter Your Bank Name"
									 	{...register("bankName", { required: "Bank Name is required.",
									 		 pattern: {
									 		 	value: /[A-Za-z]/,
									 		 	message: "invalid Bank Name"
											 }
									  })}
									/>

									
									{errors.bankName &&
										(
											<div className="invalid-feedback">{errors.bankName.message}</div>
										)
									}
								</div>
							</div>
							</div>


							<div className="row">
								<div className="form-group ">
									<label htmlFor="type"> &nbsp; Bank AccountNo<span className="required">*</span> </label>
									<input type="num" className={'form-control ' + (errors.bankAccountno ? ' is-invalid' : '')} id="bankAccountno" placeholder="Please Enter Your A/C Deatils"
										 {...register("bankAccountno", { required: "BankAccountNo is required.",
									 	pattern:{
											value:/[0-9]/,
											message:"Please Enter correct"
										} ,
										maxLength: 18, minLength:9,
									})}
									 
									/>

									
									{errors.bankAccountno &&
										(
											<div className="invalid-feedback">{errors.bankAccountno.message}</div>
										)
									}
								</div>
							</div>
								
							<div className="row">
								<div className="form-group ">
									<label htmlFor="type">&nbsp;IFSC Code<span className="required">*</span> </label>
									<input type="text" className={'form-control ' + (errors.ifscCode ? ' is-invalid' : '')} id="ifscCode" placeholder="Please Enter Your IFSCCode Details"
										 {...register("ifscCode", { required: "Please Enter Your IFSC Code",
											 pattern: {
												value:/^[A-Za-z]{4}[0-9]{1}[a-zA-Z]{6}$/,
												message: 'Invalid ifscCODE.'
											}
										})}
									 
									/>

									
									{errors.ifscCode &&
										(
											<div className="invalid-feedback">{errors.ifscCode.message}</div>
										)
									}
								</div>
							</div>



						</div>
						<div className="card-footer">
							<button type='submit' className="btn btn-primary float-right" disabled={!isValid || isSubmitting} >{isSubmitting ? 'Saving...' : 'Submit Details'}</button>
						</div>
					</form>
				}
			</div>
		
		</>
	)
}
