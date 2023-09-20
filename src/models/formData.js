class BusinessForm {
    constructor(
      businessName,
      businessInfo,
      storeName,
      categories,
      productListing,
      shipmentDetails,
      gstNo,
      bankAccountDetails,
      verifyTaxDetails,
      signature
    ) {
      this.businessName = businessName;
      this.businessInfo = businessInfo;
      this.storeName = storeName;
      this.categories = categories;
      this.productListing = productListing;
      this.shipmentDetails = shipmentDetails;
      this.gstNo = gstNo;
      this.bankAccountDetails = bankAccountDetails;
      this.verifyTaxDetails = verifyTaxDetails;
      this.signature = signature;
    }
  }
  
  module.exports = BusinessForm;
  
