const connection = require('./db');
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs')
app.get('/generate', async (req, res) => {
    const dealerId = req.query.dealerId;
    const invoiceId = req.query.invoiceId

    try {
        const db = await new Promise((resolve, reject) => {
            connection.query(
                `SELECT INV.invoice_id, INVI.item_id, tdd.dealer_id, tdd.gstin, td.dealer_invoice_name, td.dealer_address, td.city_name, td.pin_code, td.mobile, td.email_id, ls.state_code, INVI.item_name, INVI.hsn_code, INVI.item_id, INVI.qty, INVI.unit_price, INVI.total_amount, INV.invoice_number, INVI.disc_via_coupon, INVI.disc_via_points, INVI.igst, INVI.cgst, INVI.sgst, INVI.item_name, INV.i_date_time, td.is_b2b FROM tp_tyre_dealer_details AS tdd JOIN tp_tyre_dealers td ON td.dealer_id = tdd.dealer_id JOIN tp_location_pincodes AS lp ON td.pin_code = lp.pincode JOIN tp_location_cities AS lc ON lp.city_id = lc.city_id JOIN tp_location_states AS ls ON lc.state_id = ls.state_id LEFT JOIN tp_invoices INV ON INV.dealer_id = tdd.dealer_id LEFT JOIN tp_invoice_products INVI ON INVI.invoice_id = INV.invoice_id WHERE tdd.dealer_id = ${dealerId} AND INV.invoice_id = ${invoiceId} AND td.verified = 1 AND td.status = 1 GROUP BY tdd.dealer_id, INVI.item_id ORDER BY INV.invoice_id DESC`,
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });

        let retrievedData = [];

        for (let i = 0; i < db.length; i++) {
            var ItemList = [];
            if (db[i].gstin = '') {
                for (let j = 0; j <= db.length; j++) {

                    ItemList.push({
                        SlNo: '',
                        PrdDesc: db[j].item_name,
                        IsServc: 'N',
                        HsnCd: db[j].hsn_code,
                        Barcde: '',
                        Qty: db[j].qty,
                        FreeQty: 0,
                        Unit: 'PCS',
                        UnitPrice: db[j].unit_price,
                        TotAmt: db[j].total_amount,
                        Discount: db[j].disc_via_coupon + db[j].disc_via_points,
                        PreTaxVal: 1,
                        AssAmt: (db[j].total_amount - (db[j].disc_via_coupon + db[j].disc_via_points)) / 1.28,
                        GstRt: 28,
                        IgstAmt: db[j].igst,
                        CgstAmt: db[j].cgst,
                        SgstAmt: db[j].sgst,
                        CesRt: 0,
                        CesAmt: 0,
                        CesNonAdvlAmt: 0,
                        StateCesRt: 0,
                        StateCesAmt: 0,
                        StateCesNonAdvlAmt: 0,
                        OthChrg: 0,
                        TotItemVal: (db[j].total_amount - (db[j].disc_via_coupon + db[j].disc_via_points)),
                        OrdLineRef: 0,
                        OrgCntry: 'IN',
                        PrdSlNo: '0'
                    });
                }


                console.log(db.length)
                retrievedData.push({
                    Version: 1.1,
                    TranDtls: {
                        TaxSch: 'GST',
                        SupTyp: 'B2C',
                        RegRev: 'N',
                        EcmGstin: null,
                        IgstOnIntra: 'N'
                    },
                    DocDtls: {
                        Typ: 'INV',
                        No: db[i].invoice_number,
                        Dt: db[i].i_date_time
                    },
                    SellerDtls: {
                        Gstin: db[i].gstin,
                        LglNm: db[i].dealer_invoice_name,
                        TrdNm: db[i].dealer_invoice_name,
                        Addr1: db[i].dealer_address,
                        Addr2: '',
                        Loc: db[i].city_name,
                        Pin: parseInt(db[i].pin_code),
                        Stcd: db[i].state_code,
                        Ph: db[i].mobile,
                        Em: db[i].email_id
                    },
                    BuyerDtls: {
                        Gstin: '',
                        LglNm: db[i].dealer_invoice_name,
                        TrdNm: db[i].dealer_invoice_name,
                        Pos: '',
                        Addr1: db[i].dealer_address,
                        Addr2: '',
                        Loc: db[i].city_name,
                        Pin: parseInt(db[i].pin_code),
                        Stcd: db[i].state_code,
                        Ph: db[i].mobile,
                        Em: db[i].email_id
                    },
                    DispDtls: {
                        Nm: db[i].dealer_invoice_name,
                        Addr1: db[i].dealer_address,
                        Addr2: '',
                        Loc: db[i].city_name,
                        Pin: parseInt(db[i].pin_code),
                        Stcd: db[i].state_code
                    },
                    ShipDtls: {
                        Gstin:  db[i].dealer_invoice_name,
                        LglNm: db[i].dealer_invoice_name,
                        TrdNm: db[i].dealer_invoice_name,
                        Addr1: db[i].dealer_address,
                        Addr2: '',
                        Loc: db[i].city_name,
                        Pin: parseInt(db[i].pin_code),
                        Stcd: db[i].state_code
                    },
                    ItemList,
                    ValDtls: {
                        AssVal: '',
                        CgstVal: '',
                        SgstVal: '',
                        IgstVal: '',
                        CesVal: '',
                        StCesVal: '',
                        Discount: '',
                        OthChrg: '',
                        RndOffAmt: '',
                        TotInvVal: '',
                        TotInvValFc: ''
                    },
                    EwbDtls: {
                        TransId: '',
                        Distance: '',
                        TransDocNo: '',
                        TransDocDt: '',
                        VehNo: '',
                        VehType: '',
                        TransMode: ''
                    }
                });
            }
            else {
                for (let j = 0; j <= i; j++) {
                    var ItemList = [];
                    retrievedData.push({
                        Version: 1.1,
                        TranDtls: {
                            TaxSch: 'GST',
                            SupTyp: 'B2B',
                            RegRev: 'N',
                            EcmGstin: null,
                            IgstOnIntra: 'N'
                        },
                        DocDtls: {
                            Typ: 'INV',
                            No: db[i].invoice_number,
                            Dt: db[i].i_date_time
                        },
                        SellerDtls: {
                            Gstin: db[i].gstin,
                            LglNm: db[i].dealer_invoice_name,
                            TrdNm: db[i].dealer_invoice_name,
                            Addr1: db[i].dealer_address,
                            Addr2: '',
                            Loc: db[i].city_name,
                            Pin: parseInt(db[i].pin_code),
                            Stcd: db[i].state_code,
                            Ph: db[i].mobile,
                            Em: db[i].email_id
                        },
                        BuyerDtls: {
                            Gstin: db[i].gstin,
                            LglNm: db[i].dealer_invoice_name,
                            TrdNm: db[i].dealer_invoice_name,
                            Pos: '',
                            Addr1: db[i].dealer_address,
                            Addr2: '',
                            Loc: db[i].city_name,
                            Pin: parseInt(db[i].pin_code),
                            Stcd: db[i].state_code,
                            Ph: db[i].mobile,
                            Em: db[i].email_id
                        },
                        DispDtls: {
                            Nm: db[i].dealer_invoice_name,
                            Addr1: db[i].dealer_address,
                            Addr2: '',
                            Loc: db[i].city_name,
                            Pin: parseInt(db[i].pin_code),
                            Stcd: db[i].state_code
                        },
                        ShipDtls: {
                            Gstin: '',
                            LglNm: '',
                            TrdNm: '',
                            Addr1: '',
                            Addr2: '',
                            Loc: '',
                            Pin: '',
                            Stcd: ''
                        },
                        ItemList,
                        ValDtls: {
                            AssVal: '',
                            CgstVal: '',
                            SgstVal: '',
                            IgstVal: '',
                            CesVal: '',
                            StCesVal: '',
                            Discount: '',
                            OthChrg: '',
                            RndOffAmt: '',
                            TotInvVal: '',
                            TotInvValFc: ''
                        },
                        PayDtls: {
                            Nm: '',
                            AccDet: '',
                            Mode: '',
                            FinInsBr: '',
                            PayTerm: '',
                            PayInstr: '',
                            CrTrn: '',
                            DirDr: '',
                            CrDay: '',
                            PaidAmt: '',
                            PaymtDue: ''
                        },
                        EwbDtls: {
                            TransId: '',
                            Distance: '',
                            TransDocNo: '',
                            TransDocDt: '',
                            VehNo: '',
                            VehType: '',
                            TransMode: ''
                        }
                    });

                    if (db[i].item_id == db[j].item_id && db[i].invoice_id == db[j].invoice_id && db[i].dealer_id == db[j].dealer_id) {
                        ItemList.push({
                            SlNo: '',
                            PrdDesc: db[j].item_name,
                            IsServc: 'N',
                            HsnCd: db[j].hsn_code,
                            Barcde: '',
                            Qty: parseFloat(db[j].qty),
                            FreeQty: 0,
                            Unit: 'PCS',
                            UnitPrice: parseFloat(db[j].unit_price),
                            TotAmt: parseFloat(db[j].total_amount),
                            Discount: parseFloat(db[j].disc_via_coupon + db[j].disc_via_points),
                            PreTaxVal: 1,
                            AssAmt: parseFloat((db[j].total_amount - (db[j].disc_via_coupon + db[j].disc_via_points)) / 1.28),
                            GstRt: parseFloat(28),
                            IgstAmt: parseFloat(db[j].igst),
                            CgstAmt: parseFloat(db[j].cgst),
                            SgstAmt: parseFloat(db[j].sgst),
                            CesRt: 0,
                            CesAmt: 0,
                            CesNonAdvlAmt: 0,
                            StateCesRt: 0,
                            StateCesAmt: 0,
                            StateCesNonAdvlAmt: 0,
                            OthChrg: 0,
                            TotItemVal: parseFloat(db[j].total_amount - (db[j].disc_via_coupon + db[j].disc_via_points)),
                            OrdLineRef: 0,
                            OrgCntry: 'IN',
                            PrdSlNo: '0'
                        });
                    }
                }
            }
        }
        let = parsedData = JSON.stringify(retrievedData)
        // console.log(parsedData);

        res.send(parsedData);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
});

Promise.all([connection.connect()])
    .then(() => {
        console.log('Connection initialized with SEQUALIZE... with Mysql');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => console.log(error));
