'use strict';

const emails = {
    admin: "codingrohan835@gmail.com",

    verification: {
        subject: "Verify your Email",
        htmlBody: `<table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F4F7FA">
        <tbody>
          <tr>
            <td valign="top">
              <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0" bgcolor="#F4F7FA" align="center" style="margin:0 auto; table-layout: fixed;">
                <tbody>
                  <!-- START of MAIL Content -->
                  <tr>
                    <td colspan="4">
                      <!-- Logo start here -->
                      <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tbody>
                          <tr>
                            <td colspan="2" height="30"></td>
                          </tr>
                        </tbody>
                      </table>
                      <!-- Logo end here -->
                      <!-- Main CONTENT -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <tbody>
                          <tr>
                            <td height="40"></td>
                          </tr>
                          <tr style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif; color:#4E5C6E; font-size:14px; line-height:20px; margin-top:20px;">
                            <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                                <tbody>
                                  <tr>
                                    <td align="center" valign="bottom" colspan="2" cellpadding="3">
                                      <img src="https://www.opencitylabs.com/wordpress/wp-content/uploads/Logo.png" alt="OpenCityLabs" width="80" src="">
                                    </td>
                                  </tr>
                                  <tr>
                                    <td height="30" &nbsp;=""></td>
                                  </tr>
                                  <tr>
                                    <td align="center"> <span style="color:#48545d;font-size:22px;line-height: 24px;">
                                      Verify your email address
                                    </span>
    
                                  </td>
                                </tr>
                                <tr>
                                  <td height="24" &nbsp;=""></td>
                                </tr>
                                <tr>
                                  <td height="1" bgcolor="#DAE1E9"></td>
                                </tr>
                                <tr>
                                  <td height="24" &nbsp;=""></td>
                                </tr>
                                <!-- <tr>
                                  <td align="center"> <span style="color:#48545d;font-size:14px;line-height:24px;">
                                    In order to start using your OpenCityLabs account, you need to confirm your email address.
                                  </span>
    
                                </td>
                              </tr> -->
                              <tr>
                                <td height="20" &nbsp;=""></td>
                              </tr>
                              <tr>
                                <td valign="top" width="48%" align="center"> <span>
                                  <a href="{activationLink}" style="display:block; padding:15px 25px; background-color:#0087D1; color:#ffffff; border-radius:3px; text-decoration:none;">Verify Email Address</a>
                                </span>
    
                              </td>
                            </tr>
                            <tr>
                              <td height="20" &nbsp;=""></td>
                            </tr>
                            <tr>
                              <td align="center">
                                <img src="" width="54" height="2" border="0">
                              </td>
                            </tr>
                            <tr>
                              <td height="20" &nbsp;=""></td>
                            </tr>
                            <tr>
                              <td align="center">
                                <p style="color:#a2a2a2; font-size:12px; line-height:17px; font-style:italic;">If you did not sign up for this account, or any other query, you can write to us at  
                                  <a href="mailto:support@OpenCityLabs.com">support@OpenCityLabs.com</a></p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td height="60"></td>
                    </tr>
                  </tbody>
                </table>
                <!-- Main CONTENT end here -->
                <!-- PROMO column start here -->
                <!-- Show mobile promo 75% of the time -->
                <table id="promo" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
                  <!-- <tbody>
                    <tr>
                      <td colspan="2" height="20"></td>
                    </tr>
                    <tr>
                      <td colspan="2" align="center"> <span style="font-size:14px; font-weight:500; margin-bottom:10px; color:#7E8A98; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;">Get the latest OpenCityLabs App for your phone</span>
    
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" height="20"></td>
                    </tr>
                   
                    <tr>
                      <td colspan="2" height="20"></td>
                    </tr>
                  </tbody> -->
                </table>
                <!-- PROMO column end here -->
                <!-- FOOTER start here -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tbody>
                    <!-- <tr>
                      <td height="10">&nbsp;</td>
                    </tr> -->
                    <tr>
                      <td valign="top" align="center"> <span style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif; color:#9EB0C9; font-size:10px;">©
                        <a href="https://OpenCityLabs.com/" target="_blank" style="color:#9EB0C9 !important; text-decoration:none;">OpenCityLabs</a> 2018
                      </span>
    
                    </td>
                  </tr>
                  <tr>
                    <td height="50">&nbsp;</td>
                  </tr>
                </tbody>
              </table>
              <!-- FOOTER end here -->
            </td>
          </tr>
        </tbody>
      </table>
    </td>
    </tr>
    </tbody>
    </table>`
    },

    verification2fa: {
      subject: "Verify your Account",
      htmlBody: `<table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F4F7FA">
      <tbody>
        <tr>
          <td valign="top">
            <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0" bgcolor="#F4F7FA" align="center" style="margin:0 auto; table-layout: fixed;">
              <tbody>
                <!-- START of MAIL Content -->
                <tr>
                  <td colspan="4">
                    <!-- Logo start here -->
                    <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tbody>
                        <tr>
                          <td colspan="2" height="30"></td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- Logo end here -->
                    <!-- Main CONTENT -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                      <tbody>
                        <tr>
                          <td height="40"></td>
                        </tr>
                        <tr style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif; color:#4E5C6E; font-size:14px; line-height:20px; margin-top:20px;">
                          <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                              <tbody>
                                <tr>
                                  <td align="center" valign="bottom" colspan="2" cellpadding="3">
                                    <img src="https://www.opencitylabs.com/wordpress/wp-content/uploads/Logo.png" alt="OpenCityLabs" width="80" src="">
                                  </td>
                                </tr>
                                <tr>
                                  <td height="30" &nbsp;=""></td>
                                </tr>
                                <tr>
                                  <td align="center"> <span style="color:#48545d;font-size:22px;line-height: 24px;">
                                    Verify your Account
                                  </span>
  
                                </td>
                              </tr>
                              <tr>
                                <td height="24" &nbsp;=""></td>
                              </tr>
                              <tr>
                                <td height="1" bgcolor="#DAE1E9"></td>
                              </tr>
                              <tr>
                                <td height="24" &nbsp;=""></td>
                              </tr>
                              <!-- <tr>
                                <td align="center"> <span style="color:#48545d;font-size:14px;line-height:24px;">
                                  In order to login your OpenCityLabs account, you need to verify your account.
                                </span>
  
                              </td>
                            </tr> -->
                            <tr>
                              <td height="20" &nbsp;=""></td>
                            </tr>
                            <tr>
                              <td valign="top" width="48%" align="center"> <span>
                              {otp}
                              </span>
  
                            </td>
                          </tr>
                          <tr>
                            <td height="20" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td align="center">
                              <img src="" width="54" height="2" border="0">
                            </td>
                          </tr>
                          <tr>
                            <td height="20" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td align="center">
                              <p style="color:#a2a2a2; font-size:12px; line-height:17px; font-style:italic;">If you did not sign up for this account, or any other query, you can write to us at  
                                <a href="mailto:support@OpenCityLabs.com">support@OpenCityLabs.com</a></p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td height="60"></td>
                  </tr>
                </tbody>
              </table>
              <!-- Main CONTENT end here -->
              <!-- PROMO column start here -->
              <!-- Show mobile promo 75% of the time -->
              <table id="promo" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
                <!-- <tbody>
                  <tr>
                    <td colspan="2" height="20"></td>
                  </tr>
                  <tr>
                    <td colspan="2" align="center"> <span style="font-size:14px; font-weight:500; margin-bottom:10px; color:#7E8A98; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;">Get the latest OpenCityLabs App for your phone</span>
  
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" height="20"></td>
                  </tr>
                 
                  <tr>
                    <td colspan="2" height="20"></td>
                  </tr>
                </tbody> -->
              </table>
              <!-- PROMO column end here -->
              <!-- FOOTER start here -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  <!-- <tr>
                    <td height="10">&nbsp;</td>
                  </tr> -->
                  <tr>
                    <td valign="top" align="center"> <span style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif; color:#9EB0C9; font-size:10px;">©
                      <a href="https://OpenCityLabs.com/" target="_blank" style="color:#9EB0C9 !important; text-decoration:none;">OpenCityLabs</a> 2018
                    </span>
  
                  </td>
                </tr>
                <tr>
                  <td height="50">&nbsp;</td>
                </tr>
              </tbody>
            </table>
            <!-- FOOTER end here -->
          </td>
        </tr>
      </tbody>
    </table>
  </td>
  </tr>
  </tbody>
  </table>`
  },
    password: {
        subject: "Reset your Password",
        htmlBody: `<table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" align="left" valign="top" style="border-collapse: collapse; border-spacing: 0;">
        <tbody>
           <tr>
              <td align="center" valign="top" style="padding: 0;">
                 <table width="600" align="center" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; background-color: #F3F4F5; text-align: center;" border="0" valign="top" bgcolor="#F3F4F5">
                    <tbody>
                       <tr>
                          <td style="padding: 0;">
                             <div class="sc-bdVaJa gilyel" display="block" style="box-sizing: border-box; position: static; border-radius: 0; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); overflow: inherit; padding: 3rem 3rem 3rem 3rem; margin: 0rem 0rem 0rem 0rem; border-top: none; border-right: none; border-bottom: none; border-left: none; display: block;">
                                <img class="sc-bwzfXH evpGNr" src="https://www.opencitylabs.com/wordpress/wp-content/uploads/Logo.png" alt="OpenCityLabs" width="20" style="border: 0; width: 10rem;">
                             </div>
                          </td>
                       </tr>
                       <tr>
                          <td style="padding: 0;">
                             <div class="sc-bdVaJa byGfxM" display="block" style="box-sizing: border-box; position: static; border-radius: 0; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); overflow: inherit; padding: 0rem 3rem 0rem 3rem; margin: 0rem 0rem 0rem 0rem; border-top: none; border-right: none; border-bottom: none; border-left: none; display: block;">
                                <span class="sc-bxivhb jFgvCd" color="gray1" scale="1" style="color: #052D49; font-family: America, sans-serif; -webkit-letter-spacing: inherit; -moz-letter-spacing: inherit; -ms-letter-spacing: inherit; letter-spacing: inherit; margin: 0; opacity: 1; position: relative; text-align: inherit; text-transform: inherit; text-shadow: none; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); -webkit-user-select: inherit; -moz-user-select: inherit; -ms-user-select: inherit; user-select: inherit; font-size: 1rem; font-weight: 400; line-height: 1.5;">
                                   <div class="sc-kgoBCf kktUDF" overflow="hidden" style="border-top: none; border-bottom: none; border-left: none; border-right: none; border-radius: 0; box-shadow: 0 2px 0 0 rgba(5, 45, 73, 0.06999999999999995); background-color: #FFFFFF; overflow: hidden;">
                                      <div class="sc-bdVaJa jlPFGn" display="block" style="box-sizing: border-box; position: static; border-radius: 0; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); overflow: inherit; padding: 2rem 2rem 2rem 2rem; margin: 0rem 0rem 0rem 0rem; border-top: none; border-right: none; border-bottom: none; border-left: none; display: block;">
                                         <div class="sc-htpNat cpoSvg" color="gray1" scale="1" style="color: #052D49; font-family: America, sans-serif; -webkit-letter-spacing: inherit; -moz-letter-spacing: inherit; -ms-letter-spacing: inherit; letter-spacing: inherit; margin: 0; opacity: 1; position: relative; text-align: left; text-transform: inherit; text-shadow: none; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); -webkit-user-select: inherit; -moz-user-select: inherit; -ms-user-select: inherit; user-select: inherit; font-size: 1rem; font-weight: 400; line-height: 1.5;">
                                            <span class="sc-bxivhb eWjzRU" color="gray3" scale="1" size="2" style="color: #4F687A; font-family: America, sans-serif; -webkit-letter-spacing: inherit; -moz-letter-spacing: inherit; -ms-letter-spacing: inherit; letter-spacing: inherit; margin: 0; opacity: 1; position: relative; text-align: inherit; text-transform: inherit; text-shadow: none; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); -webkit-user-select: inherit; -moz-user-select: inherit; -ms-user-select: inherit; user-select: inherit; font-size: 1.3090000000000002rem; font-weight: 400; line-height: 1.25;">We received a request to reset your password.</span>
                                            <div class="sc-bdVaJa dggHpc" display="block" style="box-sizing: border-box; position: static; border-radius: 0; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); overflow: inherit; padding: 0rem 0rem 0rem 0rem; margin: 1.5rem 0rem 1.5rem 0rem; border-top: none; border-right: none; border-bottom: none; border-left: none; display: block;">Use the link below to set up a new password for your account. If you did not request
                                               to reset your password, ignore this email and the link will expire on its own.
                                            </div>
                                         </div>
                                         <a href="{newPassLink}" class="sc-jzJRlG hznfox" color="primary" type="button" role="button" style="-webkit-backface-visibility: hidden; backface-visibility: hidden; background-color: #F96854; border: 2px solid #F96854; border-radius: 0; box-sizing: border-box; display: inline-block; font-weight: 700; padding: 1rem 1.5rem; position: relative; text-align: center; text-decoration: none; text-transform: uppercase; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; white-space: inherit; cursor: pointer; color: #FFFFFF; font-size: 1rem;">
                                            <div class="sc-fjdhpX ktKmOq" style="visibility: visible;">Set New Password</div>
                                         </a>
                                      </div>
                                   </div>
                                </span>
                             </div>
                          </td>
                       </tr>
                       <tr>
                          <td style="padding: 0;">
                             <div class="sc-bdVaJa gilyel" display="block" style="box-sizing: border-box; position: static; border-radius: 0; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); overflow: inherit; padding: 3rem 3rem 3rem 3rem; margin: 0rem 0rem 0rem 0rem; border-top: none; border-right: none; border-bottom: none; border-left: none; display: block;">
                                <span class="sc-bxivhb jFgvCd" color="gray1" scale="1" style="color: #052D49; font-family: America, sans-serif; -webkit-letter-spacing: inherit; -moz-letter-spacing: inherit; -ms-letter-spacing: inherit; letter-spacing: inherit; margin: 0; opacity: 1; position: relative; text-align: inherit; text-transform: inherit; text-shadow: none; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); -webkit-user-select: inherit; -moz-user-select: inherit; -ms-user-select: inherit; user-select: inherit; font-size: 1rem; font-weight: 400; line-height: 1.5;">
                                   <!-- <div class="sc-bdVaJa cHZARy" display="block" style="box-sizing: border-box; position: static; border-radius: 0; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); overflow: inherit; padding: 0rem 0rem 3rem 0rem; margin: 0rem 0rem 0rem 0rem; border-top: none; border-right: none; border-bottom: none; border-left: none; display: block;"><img class="sc-bwzfXH fhbjHj" src="https://c5.OpenCityLabs.com/external/logo/rebrandLogoIconMark@2x.png" alt="OpenCityLabs trademark" width="8" height="8" style="border: 0; width: 4rem; height: 4rem;"></div> -->
                                   <div class="sc-bdVaJa dRtAmU" display="block" style="box-sizing: border-box; position: static; border-radius: 0; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); overflow: inherit; padding: 0rem 0rem 1.5rem 0rem; margin: 0rem 0rem 0rem 0rem; border-top: none; border-right: none; border-bottom: none; border-left: none; display: block;">
                                      <p class="sc-ifAKCX cULmEo" color="gray3" scale="1" style="color: #4F687A; font-family: America, sans-serif; -webkit-letter-spacing: inherit; -moz-letter-spacing: inherit; -ms-letter-spacing: inherit; letter-spacing: inherit; opacity: 1; position: relative; text-align: inherit; text-transform: inherit; text-shadow: none; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); -webkit-user-select: inherit; -moz-user-select: inherit; -ms-user-select: inherit; user-select: inherit; font-size: 1rem; font-weight: 400; line-height: 1.5; margin: 0.5rem 0rem;">We love hearing from you!<br>Have any questions? Please check out our <a class="sc-gqjmRU doYTvo" href="mailto:support@tinketsale.com" color="blue" scale="1" target="_self" style="background-color: transparent; color: #F96854; cursor: pointer; display: inline-block; font-weight: 700; max-width: 100%; overflow: hidden; text-decoration: none; text-decoration-skip: ink; text-overflow: ellipsis; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); vertical-align: bottom; font-size: 1rem; line-height: 1.5;">help center</a>.</p>
                                   </div>
                                   <div class="sc-bdVaJa cHZARy" display="block" style="box-sizing: border-box; position: static; border-radius: 0; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); overflow: inherit; padding: 0rem 0rem 3rem 0rem; margin: 0rem 0rem 0rem 0rem; border-top: none; border-right: none; border-bottom: none; border-left: none; display: block;"><a class="sc-gqjmRU doYTvo" href="https://www.OpenCityLabs.com" color="blue" scale="1" target="_self" style="background-color: transparent; color: #F96854; cursor: pointer; display: inline-block; font-weight: 700; max-width: 100%; overflow: hidden; text-decoration: none; text-decoration-skip: ink; text-overflow: ellipsis; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); vertical-align: bottom; font-size: 1rem; line-height: 1.5;">OpenCityLabs</a><span style="margin-left:1em;margin-right:1em;">·</span>
                                      <a class="sc-gqjmRU doYTvo" href="https://twitter.com/OpenCityLabs" color="blue" scale="1" target="_self" style="background-color: transparent; color: #F96854; cursor: pointer; display: inline-block; font-weight: 700; max-width: 100%; overflow: hidden; text-decoration: none; text-decoration-skip: ink; text-overflow: ellipsis; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); vertical-align: bottom; font-size: 1rem; line-height: 1.5;">Twitter</a><span style="margin-left:1em;margin-right:1em;">·</span>
                                      <a class="sc-gqjmRU doYTvo" href="https://www.facebook.com/OpenCityLabssocial/" color="blue" scale="1" target="_self" style="background-color: transparent; color: #F96854; cursor: pointer; display: inline-block; font-weight: 700; max-width: 100%; overflow: hidden; text-decoration: none; text-decoration-skip: ink; text-overflow: ellipsis; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); vertical-align: bottom; font-size: 1rem; line-height: 1.5;">Facebook</a>
                                   </div>
                                   <p class="sc-ifAKCX hiKSiS" color="gray3" scale="1" style="color: #4F687A; font-family: America, sans-serif; -webkit-letter-spacing: inherit; -moz-letter-spacing: inherit; -ms-letter-spacing: inherit; letter-spacing: inherit; margin: 0; opacity: 1; position: relative; text-align: inherit; text-transform: inherit; text-shadow: none; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); -webkit-user-select: inherit; -moz-user-select: inherit; -ms-user-select: inherit; user-select: inherit; font-size: 1rem; font-weight: 400; line-height: 1.5;">No. 9 , Sai Enclave, JP Nagar, Bangalore - 560076</p>
                                   <p class="sc-ifAKCX cULmEo" color="gray3" scale="1" style="color: #4F687A; font-family: America, sans-serif; -webkit-letter-spacing: inherit; -moz-letter-spacing: inherit; -ms-letter-spacing: inherit; letter-spacing: inherit; opacity: 1; position: relative; text-align: inherit; text-transform: inherit; text-shadow: none; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); -webkit-user-select: inherit; -moz-user-select: inherit; -ms-user-select: inherit; user-select: inherit; font-size: 1rem; font-weight: 400; line-height: 1.5; margin: 0.5rem 0rem;">This email was sent to
                                      <a class="sc-gqjmRU doYTvo" href="mailto:" color="blue" scale="1" target="_self" style="background-color: transparent; color: #F96854; cursor: pointer; display: inline-block; font-weight: 700; max-width: 100%; overflow: hidden; text-decoration: none; text-decoration-skip: ink; text-overflow: ellipsis; -webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1); vertical-align: bottom; font-size: 1rem; line-height: 1.5;">{userEmailId}</a>.
                                      <br>.
                                   </p>
                                </span>
                             </div>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </td>
           </tr>
        </tbody>
     </table>`
    },
    signupAdmin: {
        subject: "New user registered",
        htmlBody: ""
    }
};

module.exports = emails;