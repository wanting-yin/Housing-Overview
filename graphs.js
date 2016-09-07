﻿d3.csv("population and resident types.csv", function makeGraphs(error, projectsJson) {
    d3.csv("household types.csv", function makeGraphs(error, HouseholdJson) {
        d3.csv("industry types.csv", function makeGraphs(error, IndustryJson) {

            //Clean projectsJson data
            var populationProjects = projectsJson;
            var dateFormat = d3.time.format("%Y");
            var householdProjects = HouseholdJson;
            var industryProjects = IndustryJson;
            populationProjects.forEach(function (d) {
                d["year"] = d["Year"].toString();
                d["household"] = +d["In households"];
                d["total"] = +d["Total"];
                d["group"] = +d["In group quarters"];
            });

            HouseholdJson.forEach(function (d) {
                d["year"] = d["Year"].toString();
                d["family"] = +d["Family households"];
                d["nonfamily"] = +d["Nonfamily households"];
                d["total household"] = +d["total"];
            });
            col=Object.keys(IndustryJson[0])
            populationProjects.forEach(function(d){
                for (var i = 0; i < HouseholdJson.length; i++) {
                    if (HouseholdJson[i].Name == d.Name && HouseholdJson[i].year == d.year)
                    {
                        d["family"]=HouseholdJson[i].family;
                        d["nonfamily"]=HouseholdJson[i].nonfamily;
                        d["total household"] = HouseholdJson[i]["total household"];}}
                for (var k = 0; k < IndustryJson.length; k++) {
                    if (IndustryJson[k].NAME== d.Name && IndustryJson[k].YEAR == d.year) {
                        for (var j = 2; j < col.length; j++) {
                            d[col[j]]=+IndustryJson[k][col[j]]
                        }
                }}
            })
            
            //Create a Crossfilter instance
            var ndx = crossfilter(populationProjects);


            //Define Dimensions
            var dateDim = ndx.dimension(function (d) { return d["year"]; });
            var fipsDim = ndx.dimension(function (d) { return d["Name"]; });
            //Calculate metrics

            var numProjectsByDate = dateDim.group().reduceSum(function (d) {
                return d["total"];
            });
            var numHouseholdByDate = dateDim.group().reduceSum(function (d) {
                return d["household"];
            });
            var numGroupByDate = dateDim.group().reduceSum(function (d) {
                return d["group"];
            });
            var NumTotalByfips = fipsDim.group().reduceSum(function (d) {
                return d["total"];
            });



            var CountByFips = fipsDim.group();
            var numFamilyByDate = dateDim.group().reduceSum(function (d) {
                return d["family"];
            });
            var numNonfamilyByDate = dateDim.group().reduceSum(function (d) {
                return d["nonfamily"];
            }) ;
            var numTotalfamilyByDate = dateDim.group().reduceSum(function (d) {
                return d["total household"];
            });

            var numAgricultureByDate = dateDim.group().reduceSum(function (d) {
                return d["Agriculture, forestry, fishing and hunting, and mining"];
            });
            var numConstructionByDate = dateDim.group().reduceSum(function (d) {
                return d["Construction"];
            });
            var numManufacturingByDate = dateDim.group().reduceSum(function (d) {
                return d["Manufacturing"];
            });
            var numWholesaleByDate = dateDim.group().reduceSum(function (d) {
                return d["Wholesale trade"];
            });
            var numRetailByDate = dateDim.group().reduceSum(function (d) {
                return d["Retail trade"];
            });
            var numTransportationByDate = dateDim.group().reduceSum(function (d) {
                return d["Transportation and warehousing, and utilities"];
            });
            var numInformationByDate = dateDim.group().reduceSum(function (d) {
                return d["Information"];
            });
            var numFinanceByDate = dateDim.group().reduceSum(function (d) {
                return d["Finance and insurance, and real estate and rental and leasing"];
            });
            var numProfessionalByDate = dateDim.group().reduceSum(function (d) {
                return d["Professional, scientific, and management, and administrative and waste management services"];
            });
            var numEducationalByDate = dateDim.group().reduceSum(function (d) {
                return d["Educational services, and health care and social assistance"];
            });
            var numArtsByDate = dateDim.group().reduceSum(function (d) {
                return d["Arts, entertainment, and recreation, and accommodation and food services"];
            });
            var numOtherByDate = dateDim.group().reduceSum(function (d) {
                return d["Other services, except public administration"];
            });
            var numPublicByDate = dateDim.group().reduceSum(function (d) {
                return d["Public administration"];
            });
            //var NumHouseholdByfips = fipsDim.group().reduceSum(function (d) {
            //    return d["household"];
            //});
            //var NumGroupByfips = fipsDim.group().reduceSum(function (d) {
            //    return d["group"];
            //});

            //Charts
            //var timeChart = dc.lineChart("#time-chart");
            //var timeChart3 = dc.lineChart("#time-chart3");
            var fipsChart = dc.rowChart("#fips-row-chart");
            var timeChart2 = dc.compositeChart("#time-chart2");
            //var timeChart4 = dc.compositeChart("#time-chart4");
            var timeChart5 = dc.compositeChart("#time-chart5");
            //var householdChart = dc.compositeChart("#household-chart");
            var householdChart2 = dc.compositeChart("#household-chart2");
            //var industryChart = dc.compositeChart("#industry-chart");


            /*timeChart
                .width(600)
                .height(320)
                .margins({ top: 10, right: 10, bottom: 30, left: 65 })
                .dimension(dateDim)
                .group(numManufacturingByDate)
                .transitionDuration(500)
                .title(function (d) { return "Year:  " + d.key + "\nNumber of Population: " + d.value; })
                //.x(d3.scale.linear().domain([minDate, maxDate]))
                .x(d3.scale.ordinal().domain(dateDim))
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .xAxisLabel("Year")
                .render();
            timeChart3
                .width(600)
                .height(320)
                .margins({ top: 10, right: 10, bottom: 30, left: 65 })
                .dimension(dateDim)
                .group(numFamilyByDate)
                .transitionDuration(500)
                .title(function (d) { return "Year:  " + d.key + "\nNumber of Population: " + d.value; })
                //.x(d3.scale.linear().domain([minDate, maxDate]))
                .x(d3.scale.ordinal().domain(dateDim))
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .xAxisLabel("Year")
                .render();*/


            fipsChart
                .width(320)
                .height(440)
                .margins({ top: 10, right: 10, bottom: 0, left: 5 })
                .dimension(fipsDim)
                //.renderVerticalGridLines(false)
                .group(CountByFips)
                .render();

            timeChart2
                .width(600)
                .height(320)
                .margins({ top: 10, right: 10, bottom: 30, left: 65 })
                //.transitionDuration(500)
                .title(function (d) { return "Year:  " + d.key + "\nNumber of Population: " + d.value; })
                //.x(d3.scale.ordinal().domain(dateDim))
                .x(d3.scale.linear().domain([2000,2015]))
                //.x(d3.scale.ordinal().domain(['0','2000', '2010', '2011', '2012', '2013', '2014', '2015']))
                //.xUnits(dc.units.ordinal)
                .elasticY(true)
                .xAxisLabel("Year")
                .renderHorizontalGridLines(true)
                .legend(dc.legend().x(450).y(50).itemHeight(13).gap(5))
                .compose([dc.lineChart(timeChart2).dimension(dateDim).group(numProjectsByDate, "Total").colors('blue').dashStyle([5, 5]),
                    dc.lineChart(timeChart2).dimension(dateDim).group(numHouseholdByDate, "In Households").colors('red').dashStyle([2, 2]),
                dc.lineChart(timeChart2).dimension(dateDim).group(numGroupByDate,"In Group Quarters").colors('green').dashStyle([2, 2])
                ])
                .brushOn(false)
                .render();
            /*
            timeChart4
                .width(600)
                .height(320)
                .margins({ top: 10, right: 20, bottom: 30, left: 65 })
                .transitionDuration(1000)
                .title(function (d) { return "Year:  " + d.key + "\nNumber of Population: " + d.value; })
                //.x(d3.scale.ordinal().domain(dateDim))
                .x(d3.scale.linear().domain([2009, 2016]))
                //.x(d3.scale.ordinal().domain(['0','2000', '2010', '2011', '2012', '2013', '2014', '2015']))
                //.xUnits(dc.units.ordinal)
                .elasticY(true)
                .xAxisLabel("Year")
                .renderHorizontalGridLines(true)
                .legend(dc.legend().x(500).y(50).itemHeight(13).gap(5))
                .compose([dc.lineChart(timeChart4).dimension(dateDim).group(numAgricultureByDate, "Agriculture").colors('blue').dashStyle([5, 5]),
                    dc.lineChart(timeChart4).dimension(dateDim).group(numConstructionByDate, "Construction").colors('red').dashStyle([2, 2]),
                dc.lineChart(timeChart4).dimension(dateDim).group(numManufacturingByDate, "Manufacturing").colors('green').dashStyle([2, 2])
                ])
                .brushOn(false)
                .render();

            industryChart
                .width(600)
                .height(320)
                .margins({ top: 10, right: 10, bottom: 30, left: 65 })
                //.transitionDuration(500)
                .title(function (d) { return "Year:  " + d.key + "\nNumber of Population: " + d.value; })
                //.x(d3.scale.ordinal().domain(dateDim))
                .x(d3.scale.linear().domain([2010, 2015]))
                //.x(d3.scale.ordinal().domain(['0','2000', '2010', '2011', '2012', '2013', '2014', '2015']))
                //.xUnits(dc.units.ordinal)
                .elasticY(true)
                .xAxisLabel("Year")
                .renderHorizontalGridLines(true)
                .legend(dc.legend().x(500).y(50).itemHeight(13).gap(5))
                .compose([dc.lineChart(industryChart).dimension(dateDim).group(numAgricultureByDate, "Agriculture").colors('blue').dashStyle([5, 5]),
                    dc.lineChart(industryChart).dimension(dateDim).group(numConstructionByDate, "Construction").colors('red').dashStyle([2, 2]),
                dc.lineChart(industryChart).dimension(dateDim).group(numManufacturingByDate, "Manufacturing").colors('green').dashStyle([2, 2])
                ])
                .brushOn(false)
                .render();**/

            timeChart5
                .width(800)
                .height(330)
                .margins({ top: 10, right: 150, bottom: 30, left: 65 })
                .transitionDuration(1000)
                .title(function (d) { return "Year:  " + d.key + "\nNumber of Population: " + d.value; })
                //.x(d3.scale.ordinal().domain(dateDim))
                .x(d3.scale.linear().domain([2009, 2016]))
                //.x(d3.scale.ordinal().domain(['0','2000', '2010', '2011', '2012', '2013', '2014', '2015']))
                //.xUnits(dc.units.ordinal)
                .elasticY(true)
                .xAxisLabel("Year")
                .renderHorizontalGridLines(true)
                .legend(dc.legend().x(500).y(30).itemHeight(13).gap(5))
                .compose([dc.lineChart(timeChart5).dimension(dateDim).group(numAgricultureByDate, "Agriculture").colors("#00FF00").dashStyle([2, 2]),
                    dc.lineChart(timeChart5).dimension(dateDim).group(numConstructionByDate, "Construction").colors('red').dashStyle([2, 2]),
                dc.lineChart(timeChart5).dimension(dateDim).group(numManufacturingByDate, "Manufacturing").colors('green').dashStyle([2, 2]),
                dc.lineChart(timeChart5).dimension(dateDim).group(numWholesaleByDate, "Wholesale Trade").colors("#7f3f98").dashStyle([2, 2]),
                dc.lineChart(timeChart5).dimension(dateDim).group(numRetailByDate, "Retail Trade").colors('#24cdd4').dashStyle([2, 2]),
                dc.lineChart(timeChart5).dimension(dateDim).group(numTransportationByDate, "Transportation and warehousing, and utilities").colors('#ea018d').dashStyle([2, 2]),
                dc.lineChart(timeChart5).dimension(dateDim).group(numInformationByDate, "Information").colors('#9e015f').dashStyle([2, 2]),
                dc.lineChart(timeChart5).dimension(dateDim).group(numFinanceByDate, "Finance and insurance").colors('#770077').dashStyle([2, 2]),
                dc.lineChart(timeChart5).dimension(dateDim).group(numProfessionalByDate, "Professional, scientific, and management").colors('#007777').dashStyle([2, 2]),
                dc.lineChart(timeChart5).dimension(dateDim).group(numEducationalByDate, "Educational services and health care").colors('#768f90').dashStyle([2, 2]),
                dc.lineChart(timeChart5).dimension(dateDim).group(numArtsByDate, "Entertainment, and accommodation and food services").colors('#563957').dashStyle([2, 2]),
                dc.lineChart(timeChart5).dimension(dateDim).group(numOtherByDate, "Other services, except public administration").colors('#3a000f').dashStyle([2, 2]),
                dc.lineChart(timeChart5).dimension(dateDim).group(numPublicByDate, "Public administration").colors('#000532').dashStyle([2, 2])
                ])
                .brushOn(false)
                .render();




            householdChart2
                .width(600)
                .height(320)
                .margins({ top: 10, right: 10, bottom: 30, left: 65 })
                //.transitionDuration(500)
                .title(function (d) { return "Year:  " + d.key + "\nNumber of Household: " + d.value; })
                //.x(d3.scale.ordinal().domain(dateDim))
                .x(d3.scale.linear().domain([2000, 2015]))
                //.x(d3.scale.ordinal().domain(['0','2000', '2010', '2011', '2012', '2013', '2014', '2015']))
                //.xUnits(dc.units.ordinal)
                .elasticY(true)
                .xAxisLabel("Year")
                .renderHorizontalGridLines(true)
                .legend(dc.legend().x(400).y(40).itemHeight(13).gap(5))
                .compose([dc.lineChart(householdChart2).dimension(dateDim).group(numTotalfamilyByDate, "Total").colors('blue').dashStyle([5, 5]),
                    dc.lineChart(householdChart2).dimension(dateDim).group(numFamilyByDate, "Family Households").colors('red').dashStyle([2, 2]),
                    dc.lineChart(householdChart2).dimension(dateDim).group(numNonfamilyByDate, "Nonfamily Households").colors('green').dashStyle([2, 2])
                ])
                .brushOn(false)
                .render();

            //dc.renderAll();
        });
    });
});