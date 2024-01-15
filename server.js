const express = require("express");
const path = require("path");
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload");
const mkdirp = require("mkdirp");
const fs = require("fs-extra");
var Jimp = require('jimp');

const app = express();
require('dotenv').config();

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars');

// static path
app.use(express.static(path.join(__dirname, 'public')));

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//cookie parser
app.use(cookieParser());

//fileupload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// models ===============================================
const { Enquiry } = require("./models/enquiry");
const { User } = require("./models/user");
const { Library } = require("./models/library");
const { Blog } = require("./models/blog");
const { Result } = require("./models/result");
const { Feehead } = require("./models/feehead");
const { Receipt } = require("./models/receipt");
//Middlewares
const { auth } = require('./middleware/auth');
// const { response } = require("express");
// const receipt = require("./models/receipt");
// const enquiry = require("./models/enquiry");
// const { resolve } = require("path");

// frontend routes =========================================
app.get("/", (req, res) => {
    res.render("front/index", { layout: false });
})
app.get("/gallery", (req, res) => {
    res.render("front/gallery", { layout: false });
})
app.get("/contact", (req, res) => {
    res.render("front/contact", { layout: false });
})
app.get("/about", (req, res) => {
    res.render("front/about", { layout: false });
})
app.get("/offline", (req, res) => {
    res.render("front/offline", { layout: false });
})
app.get("/dashboard", (req, res) => {
    res.render("index/dashboard", { layout: false });
})
app.get("/enquiry", (req, res) => {
    res.render("index/enquiry", { layout: false });
})
app.get("/newuser", (req, res) => {
    res.render("index/newuser", { layout: false });
})
app.get("/newuser/teacher", (req, res) => {
    res.render("index/newteacher", { layout: false });
})
app.get("/users", (req, res) => {
    res.render("index/users", { layout: false });
})
app.get("/user-edit", (req, res) => {
    res.render("index/user-edit", { layout: false });
})
app.get("/teacher-edit", (req, res) => {
    res.render("index/teacher-edit", { layout: false });
})
app.get("/login", (req, res) => {
    res.render("authentication/login", { layout: false });
})
app.get("/classes", (req, res) => {
    res.render("index/classes", { layout: false });
})
app.get("/classroom", (req, res) => {
    res.render("index/classroom", { layout: false });
})
app.get("/teachers", (req, res) => {
    res.render("index/teachers", { layout: false });
})
app.get("/add-library", (req, res) => {
    res.render("library/add-library", { layout: false });
})
app.get("/book-edit", (req, res) => {
    res.render("library/book-edit", { layout: false });
})
app.get("/view-books", (req, res) => {
    res.render("library/view-books", { layout: false });
})
app.get("/issued-books", (req, res) => {
    res.render("library/issued-books", { layout: false });
})
app.get("/add-blog", (req, res) => {
    res.render("blog/add-blog", { layout: false });
})
app.get("/articles", (req, res) => {
    res.render("blog/articles", { layout: false });
})
app.get("/articles-detail", (req, res) => {
    res.render("blog/articles-detail", { layout: false });
})
app.get("/add-result", (req, res) => {
    res.render("result/add-result", { layout: false });
})
app.get("/view-result", (req, res) => {
    res.render("result/view-result", { layout: false });
})
app.get("/collectfees", (req, res) => {
    res.render("account/collectfees", { layout: false });
})
app.get("/fees-invoice", (req, res) => {
    res.render("account/fees-invoice", { layout: false });
})
app.get("/expense", (req, res) => {
    res.render("account/expense", { layout: false });
})

// Api routes Auth ==================
app.post("/auth-register", (req, res) => {
    User.findOne(
        { "mobile": req.body.mobile },
        (err, user) => {
            if (user) {
                return res.json({ success: false, message: 'Number already registered' });
            } else {
                const newUuser = new User({
                    mobile: req.body.mobile,
                    password: req.body.password,
                    admit: req.body.admit,
                    unireg: req.body.unireg,
                    shift: req.body.shift,
                    standard: req.body.standard,
                    firstname: req.body.firstname,
                    middlename: req.body.middlename,
                    lastname: req.body.lastname,
                    gender: req.body.gender,
                    bg: req.body.bg,
                    dob: req.body.dob,
                    district: req.body.district,
                    address: req.body.address,
                    nationality: req.body.nationality,
                    religion: req.body.religion,
                    detail: req.body.detail,
                    role: req.query.role
                });

                newUuser.save((err, doc) => {
                    if (err) return res.json({ success: false, err });

                    res.status(200).json({
                        success: true
                    })
                })
            }
        }
    )
})
app.post("/auth-register-teacher", (req, res) => {
    User.findOne(
        { "mobile": req.body.mobile },
        (err, user) => {
            if (user) {
                return res.json({ success: false, message: 'Number already registered' });
            } else {
                const newUuser = new User({
                    mobile: req.body.mobile,
                    password: req.body.password,
                    admit: req.body.admit,
                    firstname: req.body.firstname,
                    middlename: req.body.middlename,
                    lastname: req.body.lastname,
                    gender: req.body.gender,
                    bg: req.body.bg,
                    dob: req.body.dob,
                    district: req.body.district,
                    address: req.body.address,
                    nationality: req.body.nationality,
                    religion: req.body.religion,
                    detail: req.body.detail,
                    role: req.query.role
                });

                newUuser.save((err, doc) => {
                    if (err) return res.json({ success: false, err });

                    res.status(200).json({
                        success: true
                    })
                })
            }
        }
    )
})
app.post("/auth-login", (req, res) => {
    User.findOne(
        { "mobile": req.body.mobile },
        (err, user) => {
            if (!user) return res.json({ success: false, message: 'mobile' });

            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch) return res.json({ success: false, message: 'password' });

                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);

                    res.cookie('w_auth', user.token, { maxAge: 315360000000 }).status(200).json({
                        success: true,
                        user: user
                    })
                })
            })
        }
    )
})
// Api enquiry ==================
app.post("/api/send/enquiry", (req, res) => {
    const newEnquiry = new Enquiry({
        name: req.body.name,
        mobile: req.body.mobile,
        message: req.body.message,
        email: req.body.email,
        course: req.body.course,
        who: req.body.who
    });

    newEnquiry.save((err, doc) => {
        if (err) return res.json({ success: false, err });

        res.status(200).json({
            success: true
        })
    })
})

app.get('/api/get/enquiry', (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;
    let skip = parseInt(req.query.skip);

    Enquiry.find({ who: req.query.who })
        .skip(skip)
        .limit(limit)
        .sort('-date')
        .exec((err, docs) => {
            if (err) return res.status(400).send(err);
            res.send(docs);
        })
})

app.get('/api/delete/enquiry', (req, res) => {
    Enquiry.findOne({ _id: req.query._id })
        .then(product => {
            product.remove();

            res.send({ success: true });
        }).catch(err => console.log(err))
})

// api attendance ==================
app.get("/api/classroom", (req, res) => {
    let findArgs = {};
    findArgs['role'] = 0;
    findArgs['standard'] = req.query.standardParam;

    User.find(findArgs)
        .select('firstname lastname shift gender standard mobile attendance')
        .exec((err, users) => {
            if (err) return res.status(400).send(err);

            return res.status(200).send({
                users
            })
        })
})

app.get("/api/allteachers", (req, res) => {
    User.find({ role: { $in: ['1', '2', '3'] } })
        .select('firstname lastname gender standard mobile attendance role')
        .exec((err, users) => {
            if (err) return res.status(400).send(err);

            return res.status(200).send({
                users
            })
        })
})

app.post("/api/attendance", (req, res) => {
    let promises = req.body.checkedBoxes.map(checkbox => {
        if (checkbox.status == "present") {
            User.findOneAndUpdate(
                { _id: checkbox.userId, 'attendance.date': { $ne: req.body.currentDate } },
                {
                    $push:
                    {
                        attendance: {
                            "date": req.body.currentDate
                        }
                    }
                },
                { new: true },
                (err, doc) => {
                    return doc;
                }
            )
        } else if (checkbox.status == "absent") {
            User.findOneAndUpdate(
                { _id: checkbox.userId, 'attendance.date': { $eq: req.body.currentDate } },
                {
                    "$pull":
                        { "attendance": { "date": req.body.currentDate } }
                },
                { new: true },
                (err, doc) => {
                    return doc;
                }
            )
        }
    })

    Promise.all(promises).then((results) => {
        return res.status(200).json({
            success: true
        })
    })
})

// api manage users ============
app.post("/api/allusers", (req, res) => {
    let order = req.query.order ? req.query.order : 'desc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 6;
    let skip = parseInt(req.body.skip);

    let findArgs = {};
    if (req.body.standard != "") {
        findArgs['standard'] = req.body.standard;
    }
    if (req.body.role != "") {
        findArgs['role'] = req.body.role;
    }
    if (req.body.status != "") {
        findArgs['status'] = req.body.status;
    }
    if (req.body.shift != "") {
        findArgs['shift'] = req.body.shift;
    }
    if (req.body.search != "") {
        if (req.body.searchtype != "mobile") {
            findArgs[req.body.searchtype] = { $regex: req.body.search, $options: 'i' };
        } else {
            findArgs[req.body.searchtype] = req.body.search;
        }
    }

    User.find(findArgs)
        .select('firstname lastname gender standard mobile role gender status')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, users) => {
            if (err) return res.status(400).send(err);

            return res.status(200).send({
                users
            })
        })
})

app.get('/api/user/delete', (req, res) => {
    User.findByIdAndRemove(req.query.id, function (err) {
        if (err) return res.json({ success: false, err });

        return res.status(200).send({
            success: true
        })
    })
})

app.get("/api/edituser", (req, res) => {
    User.findOne(
        { "_id": req.query._id },
        (err, user) => {
            if (err) return res.status(400).send(err);

            return res.status(200).send({
                user
            })
        }
    ).select('mobile admit unireg standard shift firstname middlename lastname gender bg dob district address nationality religion detail')
})
app.get("/api/editteacher", (req, res) => {
    User.findOne(
        { "_id": req.query._id },
        (err, user) => {
            if (err) return res.status(400).send(err);

            return res.status(200).send({
                user
            })
        }
    ).select('role mobile admit firstname middlename lastname gender bg dob district address nationality religion detail')
})

app.post('/api/edituser', (req, res) => {
    User.findOne({ _id: req.query._id }, function (err, u) {
        if (err) return res.json({ success: false, err });

        req.body.password != "" ? u.password = req.body.password : "";
        u.admit = req.body.admit;
        u.unireg = req.body.unireg;
        u.shift = req.body.shift;
        u.standard = req.body.standard;
        u.firstname = req.body.firstname;
        u.middlename = req.body.middlename;
        u.lastname = req.body.lastname;
        u.gender = req.body.gender;
        u.bg = req.body.bg;
        u.dob = req.body.dob;
        u.district = req.body.district;
        u.address = req.body.address;
        u.nationality = req.body.nationality;
        u.religion = req.body.religion;
        u.detail = req.body.detail;

        u.save(function (err) {
            if (err) return res.json({ success: false, err });

            return res.status(200).send({
                success: true
            })
        })
    })
})
app.post('/api/editteacher', (req, res) => {
    User.findOne({ _id: req.query._id }, function (err, u) {
        if (err) return res.json({ success: false, err });

        req.body.password != "" ? u.password = req.body.password : "";
        u.admit = req.body.admit;
        u.role = req.query.role;
        u.firstname = req.body.firstname;
        u.middlename = req.body.middlename;
        u.lastname = req.body.lastname;
        u.gender = req.body.gender;
        u.bg = req.body.bg;
        u.dob = req.body.dob;
        u.district = req.body.district;
        u.address = req.body.address;
        u.nationality = req.body.nationality;
        u.religion = req.body.religion;
        u.detail = req.body.detail;

        u.save(function (err) {
            if (err) return res.json({ success: false, err });

            return res.status(200).send({
                success: true
            })
        })
    })
})

// blog =================
app.post("/add-blog", (req, res) => {
    const newBlog = new Blog({
        title: req.body.title,
        detail: req.body.detail,
        keyword: req.body.keyword,
        image: req.files.image.name
    });

    newBlog.save((err, doc) => {
        if (err) return res.json({ success: false, err });

        mkdirp('public/blog_images/' + doc._id)
            .then(made => {
                //upload image
                let path = 'public/blog_images/' + doc._id + '/' + req.files.image.name;

                req.files.image.mv(path, function (err) {
                    if (err) console.log(err);
                })
            })

        res.status(200).json({
            success: true
        })
    })
})

app.get('/api/articles', (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;
    let skip = parseInt(req.query.skip);
    let findArgs = {};

    if (req.query.search != "all") {
        findArgs = { $text: { $search: req.query.search } };
    }

    Blog.find(findArgs)
        .select('title date image')
        .skip(skip)
        .limit(limit)
        .sort('-date')
        .exec((err, docs) => {
            if (err) return res.status(400).send(err);
            res.send(docs);
        })
})

app.get('/api/articles-detail', (req, res) => {
    Blog
        .findOne({ '_id': req.query.id })
        .exec((err, docs) => {
            return res.status(200).send({
                docs
            })
        })
})

app.get('/api/delete/blog', (req, res) => {
    let path = 'public/blog_images/' + req.query._id;

    fs.remove(path, function (err) {
        if (err) {
            if (err) return res.json({ success: false, err });
        } else {
            Blog.findByIdAndRemove(req.query._id, function (err) {
                if (err) return res.json({ success: false, err });

                return res.status(200).send({
                    success: true
                })
            })
        }
    })
})

// library =================
app.post("/add-book", (req, res) => {
    const newLibrary = new Library({
        title: req.body.title,
        author: req.body.author,
        standard: req.body.standard,
        quantity: req.body.quantity
    });

    newLibrary.save((err, doc) => {
        if (err) return res.json({ success: false, err });

        res.status(200).json({
            success: true
        })
    })
})

app.get("/api/view-books", (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;
    let skip = parseInt(req.query.skip);

    let findArgs = {};
    findArgs['bookedBy'] = [];
    if (req.query.standard != "") {
        findArgs['standard'] = req.query.standard;
    }
    if (req.query.search != "") {
        findArgs[req.query.searchtype] = { $regex: req.query.search, $options: 'i' };
    }

    Library.find(findArgs)
        .skip(skip)
        .limit(limit)
        .sort('-date')
        .exec((err, docs) => {
            if (err) return res.status(400).send(err);
            res.send(docs);
        })
})

app.get("/api/editbook", (req, res) => {
    Library.findOne(
        { "_id": req.query._id },
        (err, book) => {
            if (err) return res.status(400).send(err);

            return res.status(200).send({
                book
            })
        }
    )
})

app.post("/api/edit-book", (req, res) => {
    Library.findOne({ _id: req.query._id }, function (err, b) {
        if (err) return res.json({ success: false, err });

        b.title = req.body.title;
        b.author = req.body.author;
        b.standard = req.body.standard;
        b.quantity = req.body.quantity;

        b.save(function (err) {
            if (err) return res.json({ success: false, err });

            return res.status(200).send({
                success: true
            })
        })
    })
})

app.post('/api/issue-book', (req, res) => {
    User.findOne(
        { "mobile": req.body.mobile },
        (err, user) => {
            if (!user) {
                return res.json({ success: "invalid" });
            } else {
                Library.find({ "bookedBy": req.body.mobile }).exec((err, docs) => {
                    if (docs.length > 4) {
                        return res.json({ success: "limit" });
                    } else {
                        Library.findOne({
                            _id: req.query._id
                        })
                            .then(book => {
                                if (book.quantity < 1) return res.json({ success: "quantity" });

                                let newBooking = [];
                                newBooking.push({
                                    "mobile": req.body.mobile,
                                    "date": Date.now()
                                })

                                if (book.bookedBy.length > 0) {
                                    book.bookedBy = [...newBooking, ...book.bookedBy]
                                } else {
                                    book.bookedBy = [...newBooking]
                                }
                                book.quantity = book.quantity - 1;

                                book.save(function (err) {
                                    if (err) return res.json({ success: false, err });

                                    return res.status(200).send({
                                        success: true
                                    })
                                })
                            })
                    }
                })
            }
        }
    )
})

app.get("/api/delete-issue", (req, res) => {
    Library.findOneAndUpdate(
        { _id: req.query._id },
        {
            $inc: { 'quantity': 1 },
            $pull:
            {
                bookedBy: {
                    "mobile": req.query.mobile
                }
            }
        },
        { new: true },
        (err, doc) => {
            if (err) return res.json({ success: false, err });

            return res.status(200).send({
                success: true
            })
        }
    )
})

app.get("/api/issued-books", (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;
    let skip = parseInt(req.query.skip);

    let findArgs = {};
    findArgs['bookedBy'] = { $exists: true, $ne: [] };
    if (req.query.standard != "") {
        findArgs['standard'] = req.query.standard;
    }
    if (req.query.search != "") {
        if (req.query.searchtype != "user-num") {
            findArgs[req.query.searchtype] = { $regex: req.query.search, $options: 'i' };
        } else {
            findArgs["bookedBy"] = req.query.search;
        }
    }

    Library.find(findArgs)
        .skip(skip)
        .limit(limit)
        .exec((err, docs) => {
            if (err) return res.status(400).send(err);
            res.send(docs);
        })
})

app.get('/api/delete/book', (req, res) => {
    Library.findOne({ _id: req.query._id })
        .then(book => {
            book.remove();

            res.send({ success: true });
        }).catch(err => console.log(err))
})

// add result ===============
app.post("/add-result", (req, res) => {
    User.findOne(
        { "mobile": req.body.mobile },
        (err, user) => {
            if (!user) return res.json({ success: "nouser" });
            if (user.role != 0) return res.json({ success: "notstudent" });

            const newResult = new Result({
                mobile: req.body.mobile,
                note: req.body.note,
                image: req.files.image.name
            });

            newResult.save((err, doc) => {
                if (err) return res.json({ success: false, err });

                mkdirp('public/result_images/' + doc._id)
                    .then(made => {
                        //upload image
                        let path = 'public/result_images/' + doc._id + '/' + req.files.image.name;

                        Jimp.read(req.files.image.tempFilePath)
                            .then(image => {
                                image.resize(600, Jimp.AUTO)
                                    .write(path);
                            })
                            .catch(err => {
                                req.files.image.mv(path, function (err) {
                                    if (err) console.log(err);
                                })
                            });
                    })

                res.status(200).json({
                    success: true
                })
            })
        }
    )
})

app.get('/api/allresult', (req, res) => {
    let findArgs = {};

    findArgs["mobile"] = req.query.search;

    Result.find(findArgs)
        .exec((err, docs) => {
            if (err) return res.status(400).send(err);
            res.send(docs);
        })
})
app.get('/api/get/result', auth, (req, res) => {
    Result.find({ "mobile": req.user.mobile })
        .exec((err, docs) => {
            if (err) return res.status(400).send(err);
            res.send(docs);
        })
})

// api accounting
app.post('/api/feehead', (req, res) => {
    Feehead.findOne(
        { "mobile": req.body.mobile, "particular": req.body.particular },
        (err, f) => {
            if (f) {
                return res.json({ success: false, message: 'feehead duplicate' });
            } else {
                let newFeeHead = new Feehead(req.body);

                newFeeHead.save((err, doc) => {
                    if (err) return res.json({ success: false, err })

                    res.status(200).json({
                        success: true
                    })
                })
            }
        }
    )
})
app.post('/api/edit/feehead', (req, res) => {
    Feehead.findOne({ _id: req.query._id }, function (err, f) {
        f.due = req.body.due;
        f.amount = req.body.amount;

        f.save(function (err) {
            res.send({ success: true });
        })
    })
})
app.get('/api/feehead/delete', (req, res) => {
    Feehead.findOne({ _id: req.query._id })
        .then(feehead => {
            feehead.remove();

            res.send({ success: true });
        }).catch(err => console.log(err))
})
app.get('/api/feehead', (req, res) => {
    let findArgs = {};
    if (req.query.type != "none") {
        findArgs['type'] = req.query.type;
    }
    findArgs['mobile'] = req.query.mobile;

    Feehead.find(findArgs)
        .exec((err, docs) => {
            if (err) return res.status(400).send(err);
            res.send(docs);
        })
})

app.post('/api/reciept', (req, res) => {
    let newReciept = new Receipt({
        mobile: req.body.mobile,
        particular: req.body.particular,
        amount: req.body.amount,
        type: req.body.type,
        month: req.body.month,
        data: req.body.data
    });

    let promiseOne = new Promise(resolve => {
        newReciept.save((err, doc) => {
            if (err) return res.json({ success: false, err })

            resolve(doc);
        })
    })

    promiseOne.then(val => {
        let promiseTwo = val.data.map(data => {
            return new Promise(resolve => {
                Feehead.findOne({ "mobile": val.mobile, "particular": data.particular }, function (err, f) {
                    f.due = f.due - parseInt(data.amount);

                    f.save(function (err) {
                        resolve("done")
                    })
                })
            })
        });

        Promise.all(promiseTwo).then(resp => {
            res.status(200).json({
                success: true
            })
        })
    })
})
app.get("/api/reciept", (req, res) => {
    User.findOne({ mobile: req.query.mobile }).select('mobile firstname lastname standard shift admit address').exec((err, user) => {
        if (!user) {
            return res.json({ success: false, message: 'no user' });
        } else {
            Receipt.find({ mobile: req.query.mobile }).exec((err, receipts) => {
                if (err) return res.status(400).send(err);
                res.status(200).json({
                    success: true,
                    receipts,
                    user
                })
            })
        }
    })
})

app.get("/api/invoice", (req, res) => {
    Receipt
        .findOne({ '_id': req.query._id })
        .exec((err, docs) => {
            if (docs != undefined) {
                User.findOne({ mobile: docs.mobile }).select("firstname lastname standard")
                    .exec((err, user) => {
                        return res.status(200).send({
                            docs,
                            user
                        })
                    })
            }
        })
})

app.get("/api/delete/invoice", (req, res) => {
    Receipt.findOne({ _id: req.query._id })
        .then(receipt => {
            let promiseTwo = receipt.data.map(data => {
                return new Promise(resolve => {
                    Feehead.findOne({ "mobile": receipt.mobile, "particular": data.particular }, function (err, f) {
                        if (f) {
                            f.due = f.due + parseInt(data.amount);

                            f.save(function (err) {
                                resolve("done")
                            })
                        } else {
                            resolve("done");
                        }
                    })
                })
            });

            Promise.all(promiseTwo).then(resp => {
                receipt.remove();

                res.send({ success: true });
            })
        }).catch(err => console.log(err))
})

app.get("/api/statistics", (req, res) => {
    Receipt.find({
        date: {
            $gte: new Date(2021, 0, 1)
            // $lt: new Date(2012, 7, 15)
        }
    }).select('amount').then(receipts => {
        let income = 0;
        receipts.forEach(data => {
            income = income + data.amount
        })
        res.send({ income });
    })
})
app.get("/api/statistics/bymonth", (req, res) => {
    Receipt.find({
        date: {
            $gte: new Date(2021, 0, 1) //month start from 0
            // $lt: new Date(2012, 7, 15)
        }
    }).select('amount date').then(receipts => {
        let incomeJan = 0;
        let incomeFeb = 0;
        let incomeMar = 0;
        let incomeApr = 0;
        let incomeMay = 0;
        let incomeJun = 0;
        let incomeJul = 0;
        let incomeAug = 0;
        let incomeSep = 0;
        let incomeOct = 0;
        let incomeNov = 0;
        let incomeDec = 0;
        receipts.forEach(data => {
            let month = data.date.toLocaleString('default', { month: 'short' });
            "Jan" == month ? incomeJan += data.amount : "Feb" == month ? incomeFeb += data.amount : "Mar" == month ? incomeMar += data.amount : "Apr" == month ? incomeApr += data.amount : "May" == month ? incomeMay += data.amount : "Jun" == month ? incomeJun += data.amount : "Jul" == month ? incomeJul += data.amount : "Aug" == month ? incomeAug += data.amount : "Sep" == month ? incomeSep += data.amount : "Oct" == month ? incomeOct += data.amount : "Nov" == month ? incomeNov += data.amount : incomeDec += data.amount;
        })
        res.send({ incomeJan, incomeFeb, incomeMar, incomeApr, incomeMay, incomeJun, incomeJul, incomeAug, incomeSep, incomeOct, incomeNov, incomeDec });
    })
})

app.get("/api/dashboard/attendance", (req, res) => {
    let promiseOne = new Promise(resolve => {
        User.countDocuments({ role: "0" }, function (err, studentCount) {
            resolve({ "val": studentCount, "name": "student" })
        });
    })

    let promiseTwo = new Promise(resolve => {
        Enquiry.countDocuments({}, function (err, enquiryCount) {
            resolve({ "val": enquiryCount, "name": "enquiry" })
        });
    })

    let promiseThree = new Promise(resolve => {
        User.countDocuments({ role: '1' }, function (err, teacherCount) {
            resolve({ "val": teacherCount, "name": "teacher" })
        });
    })

    let promiseFour = new Promise(resolve => {
        User.countDocuments({}, function (err, userCount) {
            resolve({ "val": userCount, "name": "user" })
        });
    })

    let promiseFive = new Promise(resolve => {
        User.countDocuments({ role: { $in: ['2', '3', '10'] } }, function (err, otherCount) {
            resolve({ "val": otherCount, "name": "other" })
        });
    })

    Promise.all([promiseOne, promiseTwo, promiseThree, promiseFour, promiseFive]).then(val => {
        res.send({ val });
    })
})

const port = process.env.PORT || 3000;
// const port = 3000;
app.listen(port, function () {
    console.log('server started on port 3000');
})