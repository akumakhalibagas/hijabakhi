var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET Customer page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM customer',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('customer/list',{title:"Customers",data:rows,session_store:req.session});
		});
         //console.log(query.sql);
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var customer = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from customer where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, customer, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/customers');
				}
				else{
					req.flash('msg_info', 'Delete Customer Success'); 
					res.redirect('/customers');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM customer where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/customers'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Customer can't be find!"); 
					res.redirect('/customers');
				}
				else
				{	
					console.log(rows);
					res.render('customer/edit',{title:"Edit ",data:rows[0],session_store:req.session});

				}
			}

		});
	});
});
router.put('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.assert('nama', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_pesanan = req.sanitize( 'pesanan' ).escape().trim();
		v_satuan = req.sanitize( 'satuan' ).escape().trim();
		v_warna = req.sanitize( 'warna' ).escape().trim();
		v_tanggal = req.sanitize( 'tanggal' ).escape();

		var customer = {
			nama: v_nama,
			pesanan: v_pesanan,
			satuan: v_satuan,
			warna: v_warna,
			tanggal: v_tanggal
		}

		var update_sql = 'update customer SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, customer, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('customer/edit', 
					{ 
						nama: req.param('nama'), 
						pesanan: req.param('pesanan'),
						satuan: req.param('satuan'),
						warna: req.param('warna'),
						tanggal: req.param('tanggal')
					});
				}else{
					req.flash('msg_info', 'Update customer success'); 
					res.redirect('/customers/edit/'+req.params.id);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.redirect('/customers/edit/'+req.params.id);
	}
});

router.post('/add',authentication_mdl.is_login, function(req, res, next) {
	req.assert('nama', 'silahkan isi nama ').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_pesanan = req.sanitize( 'pesanan' ).escape().trim();
		v_satuan = req.sanitize( 'satuan' ).escape().trim();
		v_warna = req.sanitize( 'warna' ).escape().trim();
		v_tanggal = req.sanitize( 'tanggal' ).escape();

		var customer = {
			nama: v_nama,
			pesanan: v_pesanan,
			satuan: v_satuan,
			warna: v_warna,
			tanggal: v_tanggal
		}

		var insert_sql = 'INSERT INTO customer SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, customer, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('customer/add-customer', 
					{ 
						nama: req.param('nama'), 
						pesanan: req.param('pesanan'),
						satuan: req.param('satuan'),
						warna: req.param('warna'),
						tanggal: req.param('tanggal'),
						session_store:req.session,
					});
				}else{
					req.flash('msg_info', 'Create customer success'); 
					res.redirect('/customers');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('customer/add-customer', 
		{ 
			nama: req.param('nama'), 
			satuan: req.param('satuan'),
			session_store:req.session
		});
	}

});

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'customer/add-customer', 
	{ 
		title: 'Tambah Nama Pesanan',
		nama: '',
		pesanan: '',
		satuan:'',
		warna:'',
		satuan:'',
		session_store:req.session
	});
});

module.exports = router;
