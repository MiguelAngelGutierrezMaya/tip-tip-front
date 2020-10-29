import React from "react";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { FormattedMessage } from "react-intl";

/**
 * Components
 */
import { Grid, Button } from '@material-ui/core';

export function ErrorPage1() {
  return (
    <div className="d-flex flex-column flex-root">
      <div
        className="d-flex flex-row-fluid flex-column bgi-size-cover bgi-position-center bgi-no-repeat pt-5 pl-5 pr-5"
        style={{
          'backgroundImage': `url(${toAbsoluteUrl("/media/error/bg-error.png")})`,
          'backgroundPosition': 'center',
          'backgroundRepeat': 'no-repeat',
          'backgroundSize': 'cover'
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <div className="d-flex flex-row-fluid flex-column justify-content-between">
              <Link to="/" className="flex-column-auto mt-5">
                <img
                  alt="Logo"
                  className="max-h-80px"
                  src={toAbsoluteUrl("/media/icon-tiptop.png")}
                />
              </Link>
              <div className="flex-column-fluid d-flex flex-column justify-content-end mt-10">
                <img
                  alt="Logo"
                  src={toAbsoluteUrl("/media/error/404.png")}
                  width="80%"
                />
              </div>
              <div className="flex-column-fluid d-flex flex-column justify-content-end mt-5 text-center">
                <h3 className="text-purple"><FormattedMessage id="ERROR.FIRST_TEXT" /></h3>
                <h3 className="text-purple"><FormattedMessage id="ERROR.SECOND_TEXT" /></h3>
                <div class="mt-2">
                  <Button variant="contained" className="btn btn-primary" color="primary" onClick={() => window.location.href = '/'}>
                    <FormattedMessage id="ERROR.BUTTON_BACK" />
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <div className="d-flex flex-row-fluid flex-column justify-content-between">
              <div className="flex-column-fluid d-flex flex-column justify-content-end">
                <img
                  alt="Logo"
                  src={toAbsoluteUrl("/media/error/img-error.png")}
                  width="100%"
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
